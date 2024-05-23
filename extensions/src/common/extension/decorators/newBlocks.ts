import { getImplementationName } from "../mixins/base/scratchInfo/index";
import { BlockMetadata, Argument, ScratchArgument, ToArguments } from "$common/types";
import { blockBundleEvent } from "$common/extension/decorators/blocks";
import { BlockType } from "$common/types/enums";
import { ExtensionInstance } from "..";
import type BlockUtilityWithID from "$scratch-vm/engine/block-utility";
import { isFunction, isString } from "$common/utils";
import { extractArgs } from "../mixins/base/scratchInfo/args";
import { TypedMethodDecorator } from ".";


type TRemoveUtil<T extends any[]> = T extends [...infer R extends any[], BlockUtilityWithID] ? R : T;
//export const blockBundleEvent = tryCreateBundleTimeEvent<BlockFunctionMetadata>("blocks");

const extractTaggedTemplateLiteral = (funcString) => {
    // Define a regular expression pattern to match the tagged template literal
    const pattern = /`([^`]*)`/;

    // Match the tagged template literal in the string
    const match = funcString.match(pattern);

    // Return the tagged template literal component
    return match ? match[1] : null;
};

export function makeDecorator<T extends Block.ScratchType,>(type: T): TemplateEngine<T>["execute"] {

    // function takes T and returns a function of TemplateEngine type
    // TemplateEngine returns based on the ScratchType of the block
    return function(builderOrStrings, ...args) {
        return function(target, context) {
            //this is of type TypedMethodDecorator
            //context is ClassMethodDecoratorContext
            const opcode = target.name;
            const internalFuncName = getImplementationName(opcode);
            let argList: any[] = args;
            const blockType = (type === "reporter") ? BlockType.Reporter : BlockType.Command;
            let textFunction;
            if (typeof builderOrStrings == "function") {
                const taggedTemplateLiteral = extractTaggedTemplateLiteral(builderOrStrings.toString());
                const tagFunction = (strings1, ...values) => {
                    // Process the tagged template literal with the provided strings and values
                    argList = values;
                    textFunction = (...values: any[]) => {
                        let result = '';
                        strings1.forEach((str, index) => {
                            result += str;
                            if (index < values.length) {
                                result += values[index];
                            }
                        });
                        return result;
                    };
                    return "";

                };
                tagFunction`Invoke function`;
                const taggedTemplate = eval("tagFunction`" + taggedTemplateLiteral + "`");

            } else {
                textFunction = (...args: any[]) => {
                    const strings = Array.isArray(builderOrStrings) ? builderOrStrings : [builderOrStrings];
                    let result = '';
                    strings.forEach((str, index) => {
                        result += str;
                        if (index < args.length) {
                            result += args[index];
                        }
                    });
                    return result;
                };
            }
            type Fn = (this: ExtensionInstance, value: any, util: BlockUtilityWithID) => void;
            const blockInfo = { type: blockType, text: textFunction, args: argList };
            context.addInitializer(function () { this.pushBlock(opcode, blockInfo as BlockMetadata<Fn>, target) });
            const isProbableAtBundleTime = !isFunction(blockInfo);
            if (isProbableAtBundleTime) {
            const { type } = blockInfo;
            blockBundleEvent?.fire({
                methodName: opcode,
                args: extractArgs(blockInfo as BlockMetadata<Fn>).map(a => isString(a) ? a : a.type),
                // is 'any' an issue? Likely!
                returns: type === "command" ? "void" : "any",
                scratchType: blockInfo.type
            });
            }

            
            //target is the function being decorated, return it
            return (function () { return this[internalFuncName].call(this, ...arguments) });
            //this is the actual function
        }
    }
}


// const reporter = makeDecorator("reporter");
// //returns 
// const command = makeDecorator("command");

// class Example {
//     @reporter`Add ${{type: "number", default: 3}} to ${"number"}`
//     simpleReporter(x: number, y: number) {
//         return x + y;
//     }
// }

// Reporter is created, it says that the function will a type based on command or reporter
// the first part of the argument is the strings, and then the second part is the arguments in the string
// the function returned is the decorator function


namespace Utility {
    // export type TypedMethodDecorator<
    //     This,
    //     Args extends any[], //args that the decorator accepts
    //     Return, //what the decorator returns
    //     Fn extends (...args: Args) => Return // function signature that matches the method being decorated.
    // > = (target: Fn, context: ClassMethodDecoratorContext<This, Fn>) => Fn;
    //ClassMethodDecoratorContext is actually defining the decorator function

    export type Method<This, Args extends any[], Return> = (this: This, ...args: Args) => Return;
    //this is target's type

    export type TaggedTemplate<TArgs extends any[], TReturn> = (strings: TemplateStringsArray, ...args: TArgs) => TReturn;
}

namespace Argument {
    export type ScratchType = "number" | "string" | "angle";

    // export type ToType<T extends ScratchType> = 
    //     T extends "number" | "angle" ? number :
    //     T extends "string" ? string :
    //     never;

    //export type ScratchConfig<T extends ScratchType = ScratchType> = T | { type: T, default?: ToType<T> };

    //export type RemoveUtil<T extends any[]> = T extends [...infer R extends any[], BlockUtilityWithID] ? R : T;

    /**
     * Transform plain typescript type to it's Scratch representation (`ScratchConfig`)
     */
    // export type FromType<T> = 
    //     T extends number ? Argument<"number"> :
    //     T extends string ? Argument<"string"> :
    //     never;

    /**
     * Transform arguments of method into a corresponding tuple of `ScratchConfig` types.
     * 
     * NOTE: The second type parameter should not be specified.
     */
    export type MapToScratch<T extends any[], Internal extends TRemoveUtil<T> = TRemoveUtil<T>> = {
        [k in keyof Internal]: Argument<Internal[k]>
    }
}

namespace Block {
    export type ScratchType = "reporter" | "command";

    export type Reportable = number | string;

    export type ToReturnType<T extends ScratchType> = 
        T extends "reporter" ? Reportable | Promise<Reportable> : 
        T extends "command" ? void | Promise<void> : 
        never;

    // export type Config = {
    //     type: ScratchType,
    //     text: string,
    //     args: Argument.ScratchConfig[]
    // }
    //Q: what is this used for?
}

interface TemplateEngine<TBlockType extends Block.ScratchType> {
    /**
     * 
     */
    execute<
        const This extends ExtensionInstance,
        const Args extends any[],
        const Return extends Block.ToReturnType<TBlockType>,
    >
    (
        strings: TemplateStringsArray, ...args: Argument.MapToScratch<Args>
    ): TypedMethodDecorator<This, Args, Return, Utility.Method<This, Args, Return>>;
    // parameters match builderOrStrings, ...args
    // args are mapped
    // return of block function is based on report or command

    /**
     * 
     */
    execute<
            const This extends ExtensionInstance,
            const Args extends any[],
            const Return extends Block.ToReturnType<TBlockType>,
        >
    (
        builder: (instance: This, tag: Utility.TaggedTemplate<Argument.MapToScratch<Args>, TypedMethodDecorator<This, Args, Return, Utility.Method<This, Args, Return>>>) 
        => TypedMethodDecorator<This, Args, Return, Utility.Method<This, Args, Return>>
    );
    // function takes the string of Tagged Template
    // parameters match builderOrStrings, ...args
    // return of block function is based on report or command
}