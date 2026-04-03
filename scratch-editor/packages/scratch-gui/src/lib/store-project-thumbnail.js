import log from './log';

export const storeProjectThumbnail = (vm, callback) => {
    try {
        getProjectThumbnail(vm, callback);
    } catch (e) {
        log.error('Project thumbnail save error', e);
        // This is intentionally fire/forget because a failure
        // to save the thumbnail is not vitally important to the user.
    }
};

export const getProjectThumbnail = (vm, callback) => {
    vm.postIOData('video', {forceTransparentPreview: true});
    vm.renderer.requestSnapshot(dataURI => {
        vm.postIOData('video', {forceTransparentPreview: false});
        callback(dataURI);
    });
    vm.renderer.draw();
};
