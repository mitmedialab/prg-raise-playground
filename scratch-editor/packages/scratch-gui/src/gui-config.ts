import PropTypes from 'prop-types';
import {ScratchStorage} from 'scratch-storage';

export type GUIConfigFactory = () => GUIConfig;
export type ProjectId = string | number;

export interface GUIConfig {
    storage: GUIStorage;
}

export interface GUIStorage {
    scratchStorage: ScratchStorage;
    backpackStorage?: GUIBackpackStorage;

    // Called multiple times (as changes happen)
    setProjectHost?(host: string): void;
    setProjectToken?(token: string): void;
    setProjectMetadata?(projectId: string | null | undefined): void;
    setAssetHost?(host: string): void;
    setTranslatorFunction?(formatMessageFn: TranslatorFunction): void;
    setBackpackHost?(host: string): void;

    saveProject(
        projectId: ProjectId | null | undefined,
        vmState: string,
        params: {
            originalId?: ProjectId;
            isCopy?: boolean | 1;
            isRemix?: boolean | 1;
            title?: string;
        }
    ): Promise<{id: ProjectId}>;

    saveProjectThumbnail?(projectId: ProjectId, thumbnail: Blob): void;
}

export interface GUIBackpackStorage {
    setSession?(session: BackpackSession | null | undefined): void;

    list(request: BackpackListItemsInput): Promise<BackpackItem[]>;
    save(item: BackpackSaveItemInput, data: SerializableData): Promise<BackpackItem>;
    delete(id: string): Promise<void>;
}

export interface BackpackSession {
    username: string;
    token: string;
}

export interface BackpackListItemsInput {
    limit: number,
    offset: number
}

export interface BackpackSaveItemInput {
    /**
     * Type of backpack object
     */
    type: BackpackItemType,

    /**
     * User-facing name of the object being saved
     */
    name: string,
}

export interface SerializableData {
    mimeType(): string,
    dataAsBase64(): Promise<string>,
    thumbnailAsBase64(): Promise<string>
}

export type BackpackItemType = 'costume' | 'sound' | 'script' | 'sprite';

export interface BackpackItem {
    /**
     * A unique identifier for the backpack item.
     * UUID format.
     */
    id: string,

    /**
     * Name of the item
     */
    name: string,

    /**
     * The type of backpack item
     */
    type: BackpackItemType,

    /**
     * The path (URL without host) of the thumbnail
     */
    thumbnail: string,

    /**
     * The full URL (incl. host) of the thumbnail
     */
    thumbnailUrl: string,

    /**
     * The md5ext of the backpack item.
     *
     * Different backpack items are loaded from different places:
     *
     * - costume -> the md5ext specified here is loaded from
     *              the asset server (has to be registered on the storage instance)
     * - sound -> same as above
     * - script -> loaded from the backpack server using `bodyUrl`. The `body` field isn't used.
     * - sprite -> same as above
     */
    body: string,

    /**
     * The full URL (incl. host) of the backpack body
     */
    bodyUrl: string,
}

export type TranslatorFunction = (
    msgObj: MessageObject,
    options?: {index: number}
) => string;

export interface MessageObject {
    id: string;
    description: string;
    defaultMessage: string;
}

export const GUIBackpackStoragePropType = PropTypes.shape({
    list: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    setSession: PropTypes.func
});

export const GUIStoragePropType = PropTypes.shape({
    scratchStorage: PropTypes.object.isRequired,
    backpackStorage: GUIBackpackStoragePropType,

    setProjectHost: PropTypes.func,
    setProjectToken: PropTypes.func,
    setProjectMetadata: PropTypes.func,
    setAssetHost: PropTypes.func,
    setTranslatorFunction: PropTypes.func,
    setBackpackHost: PropTypes.func,

    saveProject: PropTypes.func.isRequired,

    saveProjectThumbnail: PropTypes.func
});
