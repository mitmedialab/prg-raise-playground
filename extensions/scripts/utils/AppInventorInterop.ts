import { blockBundleEvent, extensionBundleEvent } from "$common";
import { BundleInfo } from "scripts/bundles";
import { getMethodsForExtension } from "scripts/typeProbing";

export default class {
    private methodTypes: ReturnType<typeof getMethodsForExtension>;
    private signatures = new Array<string>();
    private supported: boolean = false;
    private cleanup = new Array<(() => void)>;

    constructor(private info: BundleInfo) {
        extensionBundleEvent.registerCallback(({ addOns }, removeSelf) => {
            this.supported = addOns.includes("appInventor");
            removeSelf();
        });

        this.cleanup.push(
            blockBundleEvent.registerCallback((metadata) => {
                if (!this.supported) return;
                this.methodTypes ??= getMethodsForExtension(this.info);
                const { methodName } = metadata;
                const { parameterTypes, returnType, typeChecker } = this.methodTypes.get(metadata.methodName);
                const parameters = parameterTypes.map(([name, type]) => `${name}: ${typeChecker.typeToString(type)}`).join(", ");
                const signature = `${methodName}: (${parameters}) => ${typeChecker.typeToString(returnType)}`;
                this.signatures.push(signature);
                console.log(`Collected signature for ${methodName}`);
            })
        );
    }


    /**
     * NOTE: The method is prefixed with 'try' as it is not required/expected that the extension will support AppInventor, 
     * and if it does NOT nothing will be generated.
     */
    tryGenerate() {
        this.cleanup?.forEach(c => c());
        if (!this.supported) return;
        console.log(`All signatures: \n ${JSON.stringify(this.signatures, null, 2)})}`);
    }
}