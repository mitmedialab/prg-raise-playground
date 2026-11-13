// Subsumption-style arbitration for Doodlebot's expressive channels.
//
// Behaviors run concurrently and never drive the robot directly: each layer
// CLAIMS the resources it wants with a desired value and RELEASES them when
// done. For every resource the highest-priority claimant wins; when it lets
// go, the next layer's wish takes over again (or the resource returns to
// rest). So he can keep a conversation going (voice, mouth, ring) while
// turning to attend to the screen (body, gaze), and a reflex like an
// interruption can cut in on anything.
//
//   reflex        — interruptions, safety (highest)
//   program       — the child's program is running: hold the wheels still
//   conversation  — listening, thinking, speaking
//   attention     — glancing at the screen while blocks are dragged
//   idle          — small glances and wiggles when nothing else is going on (lowest)
//
// Priorities are per resource, not global: attention outranks conversation
// for the body and gaze (he looks at what the child is doing even mid-chat),
// conversation outranks attention for the mouth and ring. Idle fidgets only
// use what nobody else wants, and nothing social may turn the wheels while
// the child's program drives them.

export type Resource = "body" | "gaze" | "mouth" | "ring";
export type Layer = "reflex" | "program" | "conversation" | "attention" | "idle";

export const PRIORITY: Record<Resource, Layer[]> = {
  body: ["reflex", "program", "attention", "conversation", "idle"],
  gaze: ["reflex", "attention", "conversation", "idle"],
  mouth: ["reflex", "conversation", "attention"],
  ring: ["reflex", "conversation", "attention"],
};

const RESOURCES = Object.keys(PRIORITY) as Resource[];

export class Arbiter {
  private claims = new Map<Resource, Map<Layer, unknown>>(RESOURCES.map((r) => [r, new Map()]));
  private applied = new Map<Resource, string>();

  /**
   * @param rest    each resource's value when nobody claims it
   * @param actuate sends a resource's winning value to the robot (only called on change)
   */
  constructor(
    private rest: Record<Resource, unknown>,
    private actuate: (resource: Resource, value: unknown, owner: Layer | null) => void,
  ) { }

  claim(layer: Layer, resource: Resource, value: unknown) {
    this.claims.get(resource)!.set(layer, value);
    this.update(resource);
  }

  release(layer: Layer, ...resources: Resource[]) {
    for (const resource of resources.length ? resources : RESOURCES) {
      if (this.claims.get(resource)!.delete(layer)) this.update(resource);
    }
  }

  owner(resource: Resource): Layer | null {
    const claims = this.claims.get(resource)!;
    return PRIORITY[resource].find((layer) => claims.has(layer)) ?? null;
  }

  /** Forget what was last sent (e.g. after reconnecting) so the next update re-sends. */
  resync() {
    this.applied.clear();
    RESOURCES.forEach((resource) => this.update(resource));
  }

  private update(resource: Resource) {
    const owner = this.owner(resource);
    const value = owner ? this.claims.get(resource)!.get(owner) : this.rest[resource];
    const key = JSON.stringify(value);
    if (this.applied.get(resource) === key) return;
    this.applied.set(resource, key);
    this.actuate(resource, value, owner);
  }
}
