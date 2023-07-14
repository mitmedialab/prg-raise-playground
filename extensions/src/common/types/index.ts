export * from "./enums";
export * from "./legacy";
export * from "./utils";
export * from "./framework/index";
export * from "./framework/arguments";
export * from "./framework/blocks";
export * from "./framework/menus";
export * from "./framework/translations";

/** Constructed based on Svelte documentation: https://svelte.dev/docs#run-time-client-side-component-api-creating-a-component */
export type SvelteComponentConstructor<TProps extends Record<string, any>> = new (
    options: {
        target: Element | HTMLElement;
        anchor?: Element | HTMLElement;
        props?: TProps;
    }
) => object;