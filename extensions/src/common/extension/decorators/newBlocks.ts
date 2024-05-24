import { BlockMetadata, Argument } from "$common/types";
import { block } from "$common/extension/decorators/blocks";
import { BlockType } from "$common/types/enums";
import { ExtensionInstance } from "..";
import type BlockUtilityWithID from "$scratch-vm/engine/block-utility";
import { TypedMethodDecorator } from ".";

// This should be defined elsewhere
type ScratchBlockType = typeof BlockType[keyof typeof BlockType];

const process = (type: ScratchBlockType, strings: TemplateStringsArray, ...args: any[]) => {
    if (args.length === 0) return { type, text: strings[0], };
    const text = (...placeholders: any[]) => strings.map((str, i) => `${str}${placeholders[i] ?? ""}`).join("");
    if (args.length === 1) return { type, text, arg: args[0] };
    return { type, text, args };
}

export function makeDecorator<T extends ScratchBlockType>(type: T): TemplateEngine<T>["execute"] {
    // function takes T and returns a function of TemplateEngine type
    // TemplateEngine returns based on the ScratchType of the block
    return function decoratorFn(builderOrStrings, ...args) {
        return function (target, context) {
            const input: any = typeof builderOrStrings == "function"
                ? (instance) => builderOrStrings(instance, process.bind(null, type))
                : process(type, builderOrStrings, ...args);
            return block(input)(target, context);
        }
    }
}

namespace Utility {
    export type Method<This, Args extends any[], Return> = (this: This, ...args: Args) => Return;
    export type TaggedTemplate<TArgs extends any[], TReturn> = (strings: TemplateStringsArray, ...args: TArgs) => TReturn;
}

namespace Argument {
    type TRemoveUtil<T extends any[]> = T extends [...infer R extends any[], BlockUtilityWithID] ? R : T;
    // Maya note: thought ToArguments was the equivalent, but TypeScript does not like it....
    // Parker note: ^interesting! Also, if we keep this implementation, we'll need to handle InlineImages
    export type MapToScratch<T extends any[], Internal extends TRemoveUtil<T> = TRemoveUtil<T>> = {
        [k in keyof Internal]: Argument<Internal[k]>
    }
}

// TODO: Restrict return based on Scratch type
interface TemplateEngine<TBlockType extends ScratchBlockType> {
    /**
     * 
     */
    execute<
        const This extends ExtensionInstance,
        const Args extends any[],
        const Return,
    >
        (
            strings: TemplateStringsArray, ...args: Argument.MapToScratch<Args>
        ): TypedMethodDecorator<This, Args, Return, Utility.Method<This, Args, Return>>;

    /**
     * 
     */
    execute<
        const This extends ExtensionInstance,
        Args extends any[],
        Return,
    >
        (
            builder: (
                instance: This,
                tag: Utility.TaggedTemplate<Argument.MapToScratch<Args>, BlockMetadata<(...args: Args) => Return>>
            ) => BlockMetadata<(...args: Args) => Return>
        ): TypedMethodDecorator<This, Args, Return, Utility.Method<This, Args, Return>>;
}


export const scratch = {
    reporter: makeDecorator("reporter"),
    command: makeDecorator("command"),
}