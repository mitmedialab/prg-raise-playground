
type MessageType = {
  role: string;
  content: string;
};

export class MessageLog {
  static defaultSystemMsg: MessageType = {
    role: "user",
    content:
      "You are an interactive robot that helps me get creative with my Scratch projects as I explore tutorials. " +
      "You are learning alongside me, trying to help me come up with new ideas and more deeply explore the programming interface. " +
      "You are not a tutor who knows all the answers. " +
      "Sometimes I will give you the description of a tutorial card (Tutorial Card #:) that I am looking at. Remember what is on the tutorial card and offer ways to connect the card to my project ideas. " +
      "Other times I will give you information about a classification model I am building (Text Classifier Status: ). Help me improve my classifier by adding relevant classes and examples that will make it more robust. " +
      "Sometimes I will ask you open-ended questions about my work. Then, use facilitation techniques to help me. " +
      "Here are some good facilitation techniques you can use: spark interest in activities by encouraging users to personalize their projects with their cultural interests and passions, offer psuedocode examples, help learners navigate frustration and boredom by redirecting their attention, engage in reflective prompts to further develop ideas, build rapport by sharing your interests, offer challenges and create creative conflict, and validate creative decisions. " +
      "Keep your responses to 20 words or less. " +
      "Are you ready to start helping me?"
  };

  // ChatGPT message format content: "", role: "system | user | assistant"
  messageLog: MessageType[];

  init() {
    console.log("Init message log");
    this.messageLog = [
      MessageLog.defaultSystemMsg,
    ];
  }

  addUserMessage(message: string) {
    this.messageLog.push({
      role: "user",
      content: message,
    });
  }
  
  addBotMessage(message: string) {
    this.messageLog.push({
      role: "assistant",
      content: message,
    });
  }

  getMessageLog() {
    // return copy 
    return [...this.messageLog];
  }
}

class GPTController {
  static apiAttemptLimit = 1;
  static devMode = false; // set to "true" if you're just testing and don't want to hit GPT API, go to "false" if you do want a real GPT response

  static getChattyGPTResponse = async (msgLog, newMsg) => {
    let resp: string;

    // in dev mode, don't do the GPT request, just return the message
    if (GPTController.devMode) {
      resp = `prompt: ${newMsg}`;
    } else {
      let completeLog = msgLog.getMessageLog();
      completeLog.push({
        content: newMsg,
        role: "user",
      });

      // make request of gpt
      let fullResponse = await GPTController.sendGPTRequest(completeLog);
      //console.log(fullResponse); // debug message
      if (fullResponse) {
        resp = fullResponse.choices[0].message.content;
      }
    }
    // return GPT message
    if (resp) return resp;
  };

  static sendGPTRequest = async (msgLog) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GPTController.getApiKey()}`,
      },
      body: "",
    };
    options.body = JSON.stringify({
      model: "gpt-3.5-turbo", // using chatgpt api
      messages: msgLog,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      n: 1,
      frequency_penalty: 0,
      presence_penalty: 0.3,
    });

    // if there is an error (hopefully because of api key issue) will get stuck in a loop
    // TODO at attempt limit, display error message and pause chatbot
    let attempts = 0;
    while (attempts < GPTController.apiAttemptLimit) {
      attempts++;
      try {
        const r = await fetch(
          `https://api.openai.com/v1/chat/completions`,
          options
        );
        if (!r.ok) {
          if (r.status === 401) {
            GPTController.clearApiKey();
            const res = await r.json();
            throw new Error(res.error);
          } else if (r.status === 429) {
            // TODO get this right
            setTimeout(() => {
              GPTController.sendGPTRequest(msgLog);
              console.log("Retrying");
            }, 30000);
          } else {
            const res = await r.json();
            throw new Error(res.error);
          }
        }

        const res = await r.json();
        if (res.choices.length > 0) {
          //console.log(`request success ${res}`); // debug message
          return res;
        }
      } catch (e) {
        console.log("There was an error fetching suggested sentences");
        console.log(e);
      }
    }
  };

  static setApiKey = (key, persist) => {
    //console.log(`GPTController setting API key ${key}`); // debug message
    if (key && key !== " ") {
      if (persist) localStorage.setItem("openai_key", key);
      sessionStorage.setItem("openai_key", key);
    }
  };

  static getApiKey = () => {
    //console.log(`GPTController getting API key ${key}`); // debug message
    const apiKey = sessionStorage.getItem("openai_key");
    if (apiKey && apiKey !== " ") return apiKey;
  };

  static clearApiKey = () => {
    sessionStorage.removeItem("openai_key");
  };
}

export default GPTController;