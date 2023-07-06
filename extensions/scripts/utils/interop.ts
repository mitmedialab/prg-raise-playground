import { blockBundleEvent, extensionBundleEvent } from "$common";
import { BundleInfo } from "scripts/bundles";
import { getMethodsForExtension } from "scripts/typeProbing";

const prefix = `[App Inventor Interop]`;

/**
 * This method assists with extracting details from extensions (at _bundle time_) 
 * that indicate they should be "cross-compiled" to App Inventor extensions.
 */
export const getAppInventorGenerator = (info: BundleInfo) => {
    let methodTypes: ReturnType<typeof getMethodsForExtension>;
    let supported = false;

    const signatures = new Array<string>();

    extensionBundleEvent.registerCallback(({ addOns }, removeSelf) => {
        supported = addOns.includes("appInventor");
        removeSelf();
    });

    const cleanup = blockBundleEvent.registerCallback((metadata) => {
        if (!supported) return;
        methodTypes ??= getMethodsForExtension(info);
        const { methodName } = metadata;
        const { parameterTypes, returnType, typeChecker } = methodTypes.get(metadata.methodName);
        const parameters = parameterTypes.map(([name, type]) => `${name}: ${typeChecker.typeToString(type)}`).join(", ");
        const signature = `${methodName}: (${parameters}) => ${typeChecker.typeToString(returnType)}`;
        signatures.push(signature);
        console.log(`${prefix} Collected signature for: '${methodName}'`);
    });

    return () => {
        cleanup();
        if (!supported) return;
        console.log(`${prefix} All signatures:\n${JSON.stringify(signatures, null, 2)}`);
    }
}