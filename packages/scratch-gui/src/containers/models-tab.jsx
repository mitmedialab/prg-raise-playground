import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import VM from 'scratch-vm';

import AssetPanel from '../components/asset-panel/asset-panel.jsx';
import PaintEditorWrapper from './paint-editor-wrapper.jsx';
import CameraModal from './camera-modal.jsx';
import {connect} from 'react-redux';
import {handleFileUpload, costumeUpload} from '../lib/file-uploader.js';
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import DragConstants from '../lib/drag-constants';
import {emptyCostume} from '../lib/empty-assets';
import sharedMessages from '../lib/shared-messages';
import downloadBlob from '../lib/download-blob';

import {
    closeCameraCapture,
    openCameraCapture,
    openCostumeLibrary,
    openBackdropLibrary
} from '../reducers/modals';

import {
    activateTab,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';

import {setRestore} from '../reducers/restore-deletion';
import {showStandardAlert, closeAlertWithId} from '../reducers/alerts';

import addLibraryBackdropIcon from '../components/asset-panel/icon--add-backdrop-lib.svg';
import addLibraryCostumeIcon from '../components/asset-panel/icon--add-costume-lib.svg';
import fileUploadIcon from '../components/action-menu/icon--file-upload.svg';
import paintIcon from '../components/action-menu/icon--paint.svg';
import cameraIcon from '../components/action-menu/icon--camera.svg';
import surpriseIcon from '../components/action-menu/icon--surprise.svg';
import searchIcon from '../components/action-menu/icon--search.svg';

import costumeLibraryContent from '../lib/libraries/costumes.json';
import backdropLibraryContent from '../lib/libraries/backdrops.json';

let messages = defineMessages({
    addLibraryBackdropMsg: {
        defaultMessage: 'Choose a Backdrop',
        description: 'Button to add a backdrop in the editor tab',
        id: 'gui.modelsTab.addBackdropFromLibrary'
    },
    addLibraryCostumeMsg: {
        defaultMessage: 'Choose a Costume',
        description: 'Button to add a costume in the editor tab',
        id: 'gui.modelsTab.addCostumeFromLibrary'
    },
    addBlankCostumeMsg: {
        defaultMessage: 'Paint',
        description: 'Button to add a blank costume in the editor tab',
        id: 'gui.modelsTab.addBlankCostume'
    },
    addSurpriseCostumeMsg: {
        defaultMessage: 'Surprise',
        description: 'Button to add a surprise costume in the editor tab',
        id: 'gui.modelsTab.addSurpriseCostume'
    },
    addFileBackdropMsg: {
        defaultMessage: 'Upload Backdrop',
        description: 'Button to add a backdrop by uploading a file in the editor tab',
        id: 'gui.modelsTab.addFileBackdrop'
    },
    addFileCostumeMsg: {
        defaultMessage: 'Upload Costume',
        description: 'Button to add a costume by uploading a file in the editor tab',
        id: 'gui.modelsTab.addFileCostume'
    },
    addCameraCostumeMsg: {
        defaultMessage: 'Camera',
        description: 'Button to use the camera to create a costume costume in the editor tab',
        id: 'gui.modelsTab.addCameraCostume'
    }
});

messages = {...messages, ...sharedMessages};

class ModelsTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSelectCostume',
            'handleDeleteCostume',
            'handleDuplicateCostume',
            'handleExportCostume',
            'handleNewCostume',
            'handleNewBlankCostume',
            'handleSurpriseCostume',
            'handleSurpriseBackdrop',
            'handleFileUploadClick',
            'handleCostumeUpload',
            'handleCameraBuffer',
            'handleDrop',
            'setFileInput'
        ]);
        const {
            editingTarget,
            sprites,
            stage
        } = props;
        const target = editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage;
        if (target && target.currentCostume) {
            this.state = {selectedCostumeIndex: target.currentCostume};
        } else {
            this.state = {selectedCostumeIndex: 0};
        }
    }
    componentWillReceiveProps (nextProps) {
        const {
            editingTarget,
            sprites,
            stage
        } = nextProps;

        const target = editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage;
        if (!target || !target.costumes) {
            return;
        }

        if (this.props.editingTarget === editingTarget) {
            // If costumes have been added or removed, change costumes to the editing target's
            // current costume.
            const oldTarget = this.props.sprites[editingTarget] ?
                this.props.sprites[editingTarget] : this.props.stage;
            // @todo: Find and switch to the index of the costume that is new. This is blocked by
            // https://github.com/LLK/scratch-vm/issues/967
            // Right now, you can land on the wrong costume if a costume changing script is running.
            if (oldTarget.costumeCount !== target.costumeCount) {
                this.setState({selectedCostumeIndex: target.currentCostume});
            }
        } else {
            // If switching editing targets, update the costume index
            this.setState({selectedCostumeIndex: target.currentCostume});
        }
    }
    handleSelectCostume (costumeIndex) {
        this.props.vm.editingTarget.setCostume(costumeIndex);
        this.setState({selectedCostumeIndex: costumeIndex});
    }
    handleDeleteCostume(costumeIndex) {
        const restoreCostumeFun = this.props.vm.deleteCostume(costumeIndex);
        this.props.dispatchUpdateRestore({
            restoreFun: restoreCostumeFun,
            deletedItem: 'Costume'
        });
    }
    handleDuplicateCostume (costumeIndex) {
        this.props.vm.duplicateCostume(costumeIndex);
    }
    handleExportCostume (costumeIndex) {
        const item = this.props.vm.editingTarget.sprite.costumes[costumeIndex];
        const blob = new Blob([item.asset.data], {type: item.asset.assetType.contentType});
        downloadBlob(`${item.name}.${item.asset.dataFormat}`, blob);
    }
    handleNewCostume (costume, fromCostumeLibrary) {
        const costumes = Array.isArray(costume) ? costume : [costume];

        return Promise.all(costumes.map(c => {
            if (fromCostumeLibrary) {
                return this.props.vm.addCostumeFromLibrary(c.md5, c);
            }
            return this.props.vm.addCostume(c.md5, c);
        }));
    }
    handleNewBlankCostume () {
        const name = this.props.vm.editingTarget.isStage ?
            this.props.intl.formatMessage(messages.backdrop, {index: 1}) :
            this.props.intl.formatMessage(messages.costume, {index: 1});
        this.handleNewCostume(emptyCostume(name));
    }
    handleSurpriseCostume () {
        const item = costumeLibraryContent[Math.floor(Math.random() * costumeLibraryContent.length)];
        const split = item.md5.split('.');
        const type = split.length > 1 ? split[1] : null;
        const rotationCenterX = type === 'svg' ? item.info[0] : item.info[0] / 2;
        const rotationCenterY = type === 'svg' ? item.info[1] : item.info[1] / 2;
        const vmCostume = {
            name: item.name,
            md5: item.md5,
            rotationCenterX,
            rotationCenterY,
            bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
            skinId: null
        };
        this.handleNewCostume(vmCostume, true /* fromCostumeLibrary */);
    }
    handleSurpriseBackdrop () {
        const item = backdropLibraryContent[Math.floor(Math.random() * backdropLibraryContent.length)];
        const vmCostume = {
            name: item.name,
            md5: item.md5,
            rotationCenterX: item.info[0] && item.info[0] / 2,
            rotationCenterY: item.info[1] && item.info[1] / 2,
            bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
            skinId: null
        };
        this.handleNewCostume(vmCostume);
    }
    handleCostumeUpload (e) {
        const storage = this.props.vm.runtime.storage;
        this.props.onShowImporting();
        handleFileUpload(e.target, (buffer, fileType, fileName, fileIndex, fileCount) => {
            costumeUpload(buffer, fileType, storage, vmCostumes => {
                vmCostumes.forEach((costume, i) => {
                    costume.name = `${fileName}${i ? i + 1 : ''}`;
                });
                this.handleNewCostume(vmCostumes).then(() => {
                    if (fileIndex === fileCount - 1) {
                        this.props.onCloseImporting();
                    }
                });
            }, this.props.onCloseImporting);
        }, this.props.onCloseImporting);
    }
    handleCameraBuffer (buffer) {
        const storage = this.props.vm.runtime.storage;
        costumeUpload(buffer, 'image/png', storage, vmCostumes => {
            vmCostumes[0].name = this.props.intl.formatMessage(messages.costume, {index: 1});
            this.handleNewCostume(vmCostumes);
        });
    }
    handleFileUploadClick () {
        this.fileInput.click();
    }
    handleDrop (dropInfo) {
    }
    setFileInput (input) {
        this.fileInput = input;
    }
    formatCostumeDetails (size, optResolution) {
        // If no resolution is given, assume that the costume is an SVG
        const resolution = optResolution ? optResolution : 1;
        // Convert size to stage units by dividing by resolution
        // Round up width and height for scratch-flash compatibility
        // https://github.com/LLK/scratch-flash/blob/9fbac92ef3d09ceca0c0782f8a08deaa79e4df69/src/ui/media/MediaInfo.as#L224-L237
        return `${Math.ceil(size[0] / resolution)} x ${Math.ceil(size[1] / resolution)}`;
    }
    render () {
        const {
            dispatchUpdateRestore, // eslint-disable-line no-unused-vars
            intl,
            isRtl,
            onNewCostumeFromCameraClick,
            onNewLibraryBackdropClick,
            onNewLibraryCostumeClick,
            cameraModalVisible,
            onRequestCloseCameraModal,
            vm
        } = this.props;

        if (!vm.editingTarget) {
            return null;
        }

        const isStage = vm.editingTarget.isStage;
        const target = vm.editingTarget.sprite;

        const addLibraryMessage = isStage ? messages.addLibraryBackdropMsg : messages.addLibraryCostumeMsg;
        const addFileMessage = isStage ? messages.addFileBackdropMsg : messages.addFileCostumeMsg;
        const addSurpriseFunc = isStage ? this.handleSurpriseBackdrop : this.handleSurpriseCostume;
        const addLibraryFunc = isStage ? onNewLibraryBackdropClick : onNewLibraryCostumeClick;
        const addLibraryIcon = isStage ? addLibraryBackdropIcon : addLibraryCostumeIcon;

        // TODO: Make this a list of models end-to-end!
        const costumeData = target.costumes ? target.costumes.map(costume => ({
            name: 'cat detector',
            asset: costume.asset,
            details: '4 classes', //costume.size ? this.formatCostumeDetails(costume.size, costume.bitmapResolution) : null,
            dragPayload: costume
        })) : [];
        return (
            <AssetPanel
                buttons={[
                    {
                        title: intl.formatMessage(addLibraryMessage),
                        img: addLibraryIcon,
                        onClick: addLibraryFunc
                    },
                    {
                        title: intl.formatMessage(messages.addCameraCostumeMsg),
                        img: cameraIcon,
                        onClick: onNewCostumeFromCameraClick
                    },
                    {
                        title: intl.formatMessage(addFileMessage),
                        img: fileUploadIcon,
                        onClick: this.handleFileUploadClick,
                        fileAccept: '.svg, .png, .jpg, .jpeg, .gif',
                        fileChange: this.handleCostumeUpload,
                        fileInput: this.setFileInput,
                        fileMultiple: true
                    },
                    {
                        title: intl.formatMessage(messages.addSurpriseCostumeMsg),
                        img: surpriseIcon,
                        onClick: addSurpriseFunc
                    },
                    {
                        title: intl.formatMessage(messages.addBlankCostumeMsg),
                        img: paintIcon,
                        onClick: this.handleNewBlankCostume
                    },
                    {
                        title: intl.formatMessage(addLibraryMessage),
                        img: searchIcon,
                        onClick: addLibraryFunc
                    }
                ]}
                dragType={DragConstants.COSTUME}
                isRtl={isRtl}
                items={costumeData}
                selectedItemIndex={this.state.selectedCostumeIndex}
                onDeleteClick={target && target.costumes && target.costumes.length > 1 ?
                    this.handleDeleteCostume : null}
                onDrop={this.handleDrop}
                onDuplicateClick={this.handleDuplicateCostume}
                onExportClick={this.handleExportCostume}
                onItemClick={this.handleSelectCostume}
            >
                {target.costumes ?
                    <iframe allow="microphone; camera"
                            style={{width:'100%',height:'100%'}}
                            src="https://teachablemachine.withgoogle.com/train/image/1R4qb06R6rHTsB4TIuTZX78N0BA-WqVBJ"/>
                    :
                    null
                }
                {cameraModalVisible ? (
                    <CameraModal
                        onClose={onRequestCloseCameraModal}
                        onNewCostume={this.handleCameraBuffer}
                    />
                ) : null}
            </AssetPanel>
        );
    }
}

ModelsTab.propTypes = {
    cameraModalVisible: PropTypes.bool,
    dispatchUpdateRestore: PropTypes.func,
    editingTarget: PropTypes.string,
    intl: intlShape,
    isRtl: PropTypes.bool,
    onActivateSoundsTab: PropTypes.func.isRequired,
    onCloseImporting: PropTypes.func.isRequired,
    onNewCostumeFromCameraClick: PropTypes.func.isRequired,
    onNewLibraryBackdropClick: PropTypes.func.isRequired,
    onNewLibraryCostumeClick: PropTypes.func.isRequired,
    onRequestCloseCameraModal: PropTypes.func.isRequired,
    onShowImporting: PropTypes.func.isRequired,
    sprites: PropTypes.shape({
        id: PropTypes.shape({
            costumes: PropTypes.arrayOf(PropTypes.shape({
                url: PropTypes.string,
                name: PropTypes.string.isRequired,
                skinId: PropTypes.number
            }))
        })
    }),
    stage: PropTypes.shape({
        sounds: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired
        }))
    }),
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    editingTarget: state.scratchGui.targets.editingTarget,
    isRtl: state.locales.isRtl,
    sprites: state.scratchGui.targets.sprites,
    stage: state.scratchGui.targets.stage,
    dragging: state.scratchGui.assetDrag.dragging,
    cameraModalVisible: state.scratchGui.modals.cameraCapture
});

const mapDispatchToProps = dispatch => ({
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    onNewLibraryBackdropClick: e => {
        e.preventDefault();
        dispatch(openBackdropLibrary());
    },
    onNewLibraryCostumeClick: e => {
        e.preventDefault();
        dispatch(openCostumeLibrary());
    },
    onNewCostumeFromCameraClick: () => {
        dispatch(openCameraCapture());
    },
    onRequestCloseCameraModal: () => {
        dispatch(closeCameraCapture());
    },
    dispatchUpdateRestore: restoreState => {
        dispatch(setRestore(restoreState));
    },
    onCloseImporting: () => dispatch(closeAlertWithId('importingAsset')),
    onShowImporting: () => dispatch(showStandardAlert('importingAsset'))
});

export default errorBoundaryHOC('Models Tab')(
    injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps
    )(ModelsTab))
);
