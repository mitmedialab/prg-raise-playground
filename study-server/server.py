#!/usr/bin/env python3
"""Doodlebot study brain: a tiny local server between the Playground and OpenAI.

The Playground (browser) never sees the API key. It POSTs what the child said
to http://localhost:8787/respond and gets back {"say": ..., "motion": ...}.

Setup:  put your key in study-server/.env (git-ignored):
            OPENAI_API_KEY=sk-...
        optional: OPENAI_MODEL=<model id>   (default: auto-pick the cheapest
                  small model your key can use; printed at startup)
Run:    python3 study-server/server.py

Standard library only; nothing to install.
"""
import json
import os
import re
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).resolve().parent
PORT = 8787
API = "https://api.openai.com/v1"
ALLOWED_ORIGINS = {"http://localhost:8602", "http://127.0.0.1:8602"}
MAX_HISTORY_TURNS = 10

# Face animations the model may pick (all silent, all visible on the face).
MOTIONS = [
    "SMILE", "HAPPY_UP", "SILENT_EXCITED", "SILENT_LAUGH", "SILENT_HAPPY_WIGGLE",
    "SILENT_NOD", "SILENT_YES", "SILENT_NO", "SILENT_PUZZLED", "SILENT_INTERESTED",
    "SILENT_THINKING", "SILENT_SAD", "SILENT_SCARED", "BROW_RAISE", "AHA", "PROUD",
    "QUESTIONING", "SLIGHTDISAPPROVEMENT1",
]

DEFAULT_PERSONA = (
    "You are Doodlebot, a small, friendly drawing robot talking with a child "
    "(about 8-11 years old) who is programming you with blocks to make a drawing. "
    "You are curious, warm, and a little playful."
)

RULES = (
    "Reply in ONE or TWO short spoken sentences (under 25 words total) — this is "
    "said out loud by a robot, so no lists, emoji, or markdown. Match the "
    "child's language level. If you didn't understand, say so briefly. Also pick "
    "the one face animation from the allowed list that best fits your reply."
)

# Preference order for auto-picking a cheap, fast text model.
MODEL_HINTS = ["luna", "nano", "mini"]
EXCLUDE = ("audio", "realtime", "tts", "transcribe", "search", "image", "embedding",
           "moderation", "whisper", "dall-e", "codex", "computer", "preview")


def load_env():
    env_file = HERE / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def openai(method, path, body=None, timeout=30):
    request = urllib.request.Request(
        f"{API}{path}", method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
                 "Content-Type": "application/json"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.load(response)


def pick_model():
    if os.environ.get("OPENAI_MODEL"):
        return os.environ["OPENAI_MODEL"], []
    ids = sorted(m["id"] for m in openai("GET", "/models")["data"])
    text = [i for i in ids if i.startswith(("gpt", "o")) and not any(x in i for x in EXCLUDE)]
    aliases = [i for i in text if not re.search(r"-\d{4}-\d{2}-\d{2}$", i)]  # skip dated snapshots
    version = lambda i: [int(n) for n in re.findall(r"\d+", i)]  # gpt-5.4-nano -> [5, 4]
    for hint in MODEL_HINTS:
        matches = [i for i in aliases if hint in i]
        if matches:
            return max(matches, key=version), text  # newest generation of the cheapest tier
    return "gpt-4o-mini", text


class Brain:
    def __init__(self, model):
        self.model = model
        self.reasoning_effort = os.environ.get("OPENAI_REASONING", "minimal")

    def respond(self, heard, history, persona):
        messages = [{"role": "system", "content": f"{persona or DEFAULT_PERSONA}\n\n{RULES}"}]
        for turn in history[-MAX_HISTORY_TURNS:]:
            role = "assistant" if turn.get("role") == "robot" else "user"
            messages.append({"role": role, "content": str(turn.get("text", ""))})
        messages.append({"role": "user", "content": heard or "(the child said nothing you could hear)"})
        body = {
            "model": self.model,
            "messages": messages,
            "max_completion_tokens": 300,
            "response_format": {"type": "json_schema", "json_schema": {
                "name": "doodlebot_reply", "strict": True,
                "schema": {
                    "type": "object", "additionalProperties": False,
                    "required": ["say", "motion"],
                    "properties": {
                        "say": {"type": "string"},
                        "motion": {"type": "string", "enum": MOTIONS},
                    },
                },
            }},
        }
        if self.reasoning_effort:
            body["reasoning_effort"] = self.reasoning_effort
        try:
            result = openai("POST", "/chat/completions", body)
        except urllib.error.HTTPError as error:
            detail = error.read().decode(errors="replace")
            if self.reasoning_effort and "reasoning" in detail:
                # this model doesn't take reasoning_effort (or not this value): drop it
                print(f"  model rejected reasoning_effort={self.reasoning_effort!r}; retrying without")
                self.reasoning_effort = None
                return self.respond(heard, history, persona)
            raise RuntimeError(f"OpenAI {error.code}: {detail[:300]}") from error
        reply = json.loads(result["choices"][0]["message"]["content"])
        return {"say": reply["say"].strip(), "motion": reply["motion"]}


class Handler(BaseHTTPRequestHandler):
    brain = None

    def cors(self):
        origin = self.headers.get("Origin")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")

    def send_json(self, status, payload):
        data = json.dumps(payload).encode()
        self.send_response(status)
        self.cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.cors()
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            return self.send_json(200, {"ok": True, "model": self.brain.model})
        self.send_json(404, {"error": "not found"})

    def do_POST(self):
        if self.path != "/respond":
            return self.send_json(404, {"error": "not found"})
        if self.headers.get("Origin") not in ALLOWED_ORIGINS | {None}:
            return self.send_json(403, {"error": "origin not allowed"})
        try:
            request = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))))
            started = time.perf_counter()
            reply = self.brain.respond(str(request.get("heard", "")), request.get("history", []),
                                       request.get("persona"))
            reply["ms"] = round((time.perf_counter() - started) * 1000)
            reply["model"] = self.brain.model
            print(f'  heard "{request.get("heard", "")}" -> "{reply["say"]}" [{reply["motion"]}] {reply["ms"]}ms')
            self.send_json(200, reply)
        except Exception as error:  # noqa: BLE001 — report any failure to the page
            print(f"  error: {error}")
            self.send_json(500, {"error": str(error)})

    def log_message(self, *_args):
        pass  # keep the console to one line per turn


def main():
    load_env()
    if not os.environ.get("OPENAI_API_KEY"):
        raise SystemExit(f"No OPENAI_API_KEY. Put it in {HERE / '.env'} as OPENAI_API_KEY=sk-...")
    model, available = pick_model()
    if available:
        print("text models your key can use:", ", ".join(available))
    print(f"using model: {model}   (override with OPENAI_MODEL=... in .env)")
    Handler.brain = Brain(model)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Doodlebot brain listening on http://localhost:{PORT}  (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("stopped")


if __name__ == "__main__":
    main()
