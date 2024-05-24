import { getImplementationName } from "../mixins/base/scratchInfo/index";
import { BlockMetadata, Argument, ScratchArgument, ToArguments } from "$common/types";
import { blockBundleEvent } from "$common/extension/decorators/blocks";
import { BlockType } from "$common/types/enums";
import { ExtensionInstance } from "..";
import type BlockUtilityWithID from "$scratch-vm/engine/block-utility";
import { isFunction, isString } from "$common/utils";
import { extractArgs } from "../mixins/base/scratchInfo/args";
import { TypedMethodDecorator } from ".";




const extractTaggedTemplateLiteral = (funcString) => {
    // Define a regular expression pattern to match the tagged template literal
    const pattern = /`([^`]*)`/;
    // Match the tagged template literal in the string
    const match = funcString.match(pattern);
    // Return the tagged template literal component
    return match ? match[1] : null;
};

export function makeDecorator<T>(type: T): TemplateEngine<T>["execute"] {

    // function takes T and returns a function of TemplateEngine type
    // TemplateEngine returns based on the ScratchType of the block
    return function decoratorFn<
        const Return
    >(builderOrStrings, ...args) {
        return function (target, context) {
            // Defining block characteristics
            const opcode = target.name;
            const internalFuncName = getImplementationName(opcode);
            let argList: any[] = args;
            const blockType = (type === "reporter") ? BlockType.Reporter : BlockType.Command;

            let textFunction;
            if (typeof builderOrStrings == "function") {
                // Get the tagged template string
                const taggedTemplateLiteral = extractTaggedTemplateLiteral(builderOrStrings.toString());
                const tagFunction = (strings1, ...values) => {
                    // Set the arguments
                    argList = values;
                    // Set the text function
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
                // Initiate the function?
                tagFunction`For some reason, I need this line for the line below...`;
                // Call the function and set arguments and text function
                const taggedTemplate = eval("tagFunction`" + taggedTemplateLiteral + "`");

            } else {
                // Set the text function
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

            // Push the block
            //type Fn = (this: This extends ExtensionInstance, value: any, util: BlockUtilityWithID) => void;
            type Fn = (...args) => Return;
            const blockInfo = { type: blockType, text: textFunction, args: argList };
            context.addInitializer(function () { this.pushBlock(opcode, blockInfo as BlockMetadata<Fn>, target) });
            
            // bundle events
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

            return (function () { return this[internalFuncName].call(this, ...arguments) });
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
    export type MapToScratch<T extends any[], Internal extends TRemoveUtil<T> = TRemoveUtil<T>> = {
        [k in keyof Internal]: Argument<Internal[k]>
    }
}

interface TemplateEngine<TBlockType> {
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
            const Args extends any[],
            const Return,
        >
    (
        builder: (instance: This, tag: Utility.TaggedTemplate<Argument.MapToScratch<Args>, TypedMethodDecorator<This, Args, Return, Utility.Method<This, Args, Return>>>) 
        => TypedMethodDecorator<This, Args, Return, Utility.Method<This, Args, Return>>
    );
}