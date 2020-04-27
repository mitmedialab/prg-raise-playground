import {defineMessages} from 'react-intl';
import sharedMessages from '../shared-messages';

let messages = defineMessages({
    meow: {
        defaultMessage: 'Meow',
        description: 'Name for the meow sound',
        id: 'gui.defaultProject.meow'
    },
    variable: {
        defaultMessage: 'my variable',
        description: 'Name for the default variable',
        id: 'gui.defaultProject.variable'
    }
});

messages = {...messages, ...sharedMessages};

// use the default message if a translation function is not passed
const defaultTranslator = msgObj => msgObj.defaultMessage;

/**
 * Generate a localized version of the default project
 * @param {function} translateFunction a function to use for translating the default names
 * @return {object} the project data json for the default project
 */
const projectData = translateFunction => {
    const translator = translateFunction || defaultTranslator;
    return ({
        targets: [
            {
                isStage: true,
                name: 'Stage',
                variables: {
                    '`jEk@4|i[#Fk?(8x)AV.-my variable': [
                        translator(messages.variable),
                        0
                    ]
                },
                lists: {},
                broadcasts: {},
                blocks: {},
                currentCostume: 0,
                costumes: [
                    {
                        assetId: 'cd21514d0531fdffb22204e0ec5ed84a',
                        name: translator(messages.backdrop, {index: 1}),
                        md5ext: 'cd21514d0531fdffb22204e0ec5ed84a.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 240,
                        rotationCenterY: 180
                    }
                ],
                sounds: [
                    {
                        assetId: '83a9787d4cb6f3b7632b4ddfebf74367',
                        name: translator(messages.pop),
                        dataFormat: 'wav',
                        format: '',
                        rate: 11025,
                        sampleCount: 258,
                        md5ext: '83a9787d4cb6f3b7632b4ddfebf74367.wav'
                    }
                ],
                volume: 100
            },
            {
                isStage: false,
                name: translator(messages.sprite, {index: 1}),
                variables: {},
                lists: {},
                broadcasts: {},
                blocks: {},
                currentCostume: 0,
                costumes: [
                    {
                        assetId: '0579fe60bb3717c49dfd7743caa84ada',
                        name: 'neutral',
                        bitmapResolution: 1,
                        md5ext: '0579fe60bb3717c49dfd7743caa84ada.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 48,
                        rotationCenterY: 50
                    },

                    {
                        assetId: '26c688d7544757225ff51cd2fb1519b5',
                        name: 'happy',
                        bitmapResolution: 1,
                        md5ext: '26c688d7544757225ff51cd2fb1519b5.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 48,
                        rotationCenterY: 50
                    },

                    {
                        assetId: 'adf61e2090f8060e1e8b2b0604d03751',
                        name: 'ecstatic',
                        bitmapResolution: 1,
                        md5ext: 'adf61e2090f8060e1e8b2b0604d03751.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 48,
                        rotationCenterY: 50
                    },

                    {
                        assetId: '594704bf12e3c4d9e83bb91661ad709a',
                        name: 'angry',
                        bitmapResolution: 1,
                        md5ext: '594704bf12e3c4d9e83bb91661ad709a.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 48,
                        rotationCenterY: 50
                    },

                ],
                sounds: [
                    {
                        assetId: '83a9787d4cb6f3b7632b4ddfebf74367',
                        name: 'pop',
                        dataFormat: 'wav',
                        format: '',
                        rate: 22050,
                        sampleCount: 18688,
                        md5ext: '83a9787d4cb6f3b7632b4ddfebf74367.wav'
                    }
                ],
                volume: 100,
                visible: true,
                x: 0,
                y: 0,
                size: 100,
                direction: 90,
                draggable: false,
                rotationStyle: 'all around'
            }
        ],
        meta: {
            semver: '3.0.0',
            vm: '0.1.0',
            agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36' // eslint-disable-line max-len
        }
    });
};


export default projectData;
