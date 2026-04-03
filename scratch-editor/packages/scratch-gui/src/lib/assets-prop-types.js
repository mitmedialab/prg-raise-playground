import PropTypes from 'prop-types';

// The backdrops json effectively has the same shape as costumes
const costumeShape = PropTypes.shape({
    assetId: PropTypes.string,
    bitmapResolution: PropTypes.number,
    dataFormat: PropTypes.string,
    md5ext: PropTypes.string,
    name: PropTypes.string,
    rotationCenterX: PropTypes.number,
    rotationCenterY: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string)
});

const soundShape = PropTypes.shape({
    assetId: PropTypes.string,
    dataFormat: PropTypes.string,
    format: PropTypes.string,
    md5ext: PropTypes.string,
    name: PropTypes.string,
    rate: PropTypes.number,
    sampleCount: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string)
});

const spriteShape = PropTypes.shape({
    costumes: PropTypes.arrayOf(costumeShape),
    isStage: PropTypes.bool,
    name: PropTypes.string,
    sounds: PropTypes.arrayOf(soundShape),
    tags: PropTypes.arrayOf(PropTypes.string)
});

export {
    costumeShape,
    soundShape,
    spriteShape
};
