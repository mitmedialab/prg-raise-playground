import { BlockMetadata, Argument, ReturnTypeByBlockType, ScratchBlockType, NoArgsBlock, OneArgBlock, BlockUtilityWithID, InlineImage, InlineImageSpecifier } from "$common/types";
import { block } from "$common/extension/decorators/blocks";
import { ExtensionInstance } from "..";
import { TypedMethodDecorator } from ".";

const process = (type: ScratchBlockType, strings: TemplateStringsArray, ...args: any[]) => {
    if (args.length === 0) return { type, text: strings[0], } satisfies NoArgsBlock;
    const text = (...placeholders: any[]) => strings.map((str, i) => `${str}${placeholders[i] ?? ""}`).join("");
    if (args.length === 1) return { type, text, arg: args[0] } satisfies OneArgBlock;
    return { type, text, args };
}

export function makeDecorator<T extends ScratchBlockType>(type: T): TemplateEngine<T>["execute"] {
    type AnyBlockMetadata = BlockMetadata<(...args: any[]) => any>;

    type FirstArgumentAsFunction = (instance: ExtensionInstance, tag: Utility.TaggedTemplate<any[], AnyBlockMetadata>) => AnyBlockMetadata;
    type FirstArgumentAsTemplateStrings = TemplateStringsArray;
    type FirstArgument = FirstArgumentAsFunction | FirstArgumentAsTemplateStrings;

    return function decoratorFn(builderOrStrings: FirstArgument, ...args) {
        return function (target, context) {

            type BlockMetadataFunction = (instance: ExtensionInstance) => AnyBlockMetadata

            const input = typeof builderOrStrings == "function"
                ? ((instance: ExtensionInstance) => builderOrStrings.call(instance, instance, process.bind(null, type))) satisfies BlockMetadataFunction
                : process(type, builderOrStrings, ...args) as AnyBlockMetadata;

            return block(input)(target, context);
        }
    }
}

namespace Utility {
    export type TaggedTemplate<Args extends any[], Return> = (strings: TemplateStringsArray, ...args: Args) => Return;
    export type OptionalPromise<T> = T | Promise<T>;
}


namespace Argument {
    type TRemoveUtil<T extends any[]> = T extends [...infer R extends any[], BlockUtilityWithID] ? R : T;
    export type MapToScratch<T extends any[], Internal extends TRemoveUtil<T> = TRemoveUtil<T>> = {
        [k in keyof Internal]:
        Internal[k] extends BlockUtilityWithID ? never :
        Internal[k] extends InlineImageSpecifier ? InlineImage :
        Argument<Internal[k]>
    }
}

// TODO: Restrict return based on Scratch type
interface TemplateEngine<TBlockType extends ScratchBlockType> {
    /**
     * 
     */
    execute<
        This extends ExtensionInstance,
        Args extends any[],
        Return extends Utility.OptionalPromise<ReturnTypeByBlockType<TBlockType>>
    >
        (
            strings: TemplateStringsArray, ...args: Argument.MapToScratch<Args>
        ): TypedMethodDecorator<This, Args, Return, ((...args: Args) => Return)>;

    /**
     * 
     */
    execute<
        This extends ExtensionInstance,
        Args extends any[],
        Return extends Utility.OptionalPromise<ReturnTypeByBlockType<TBlockType>>,
    >
        (
            builder: (
                this: This,
                instance: This,
                tag: Utility.TaggedTemplate<Argument.MapToScratch<Args>, BlockMetadata<(...args: Args) => Return>>,
            ) => BlockMetadata<(...args: Args) => Return>
        ): TypedMethodDecorator<This, Args, Return, ((...args: Args) => Return)>;
}


export const scratch = {
    reporter: makeDecorator("reporter"),
    command: makeDecorator("command"),
    button: makeDecorator("button"),
}