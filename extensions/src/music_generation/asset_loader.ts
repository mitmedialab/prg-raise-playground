import formatMessage from 'format-message';
import piano24 from './assets/instruments/1-piano/24.mp3';
import piano36 from './assets/instruments/1-piano/36.mp3';
import piano48 from './assets/instruments/1-piano/48.mp3';
import piano60 from './assets/instruments/1-piano/60.mp3';
import piano72 from './assets/instruments/1-piano/72.mp3';
import piano84 from './assets/instruments/1-piano/84.mp3';
import piano96 from './assets/instruments/1-piano/96.mp3';
import piano108 from './assets/instruments/1-piano/108.mp3';
import electricPiano60 from './assets/instruments/2-electric-piano/60.mp3';
import organ60 from './assets/instruments/3-organ/60.mp3';
import guitar60 from './assets/instruments/4-guitar/60.mp3';
import electricGuitar60 from './assets/instruments/5-electric-guitar/60.mp3';
import bass36 from './assets/instruments/6-bass/36.mp3';
import bass48 from './assets/instruments/6-bass/48.mp3';
import pizzicato60 from './assets/instruments/7-pizzicato/60.mp3';
import cello36 from './assets/instruments/8-cello/36.mp3';
import cello48 from './assets/instruments/8-cello/48.mp3';
import cello60 from './assets/instruments/8-cello/60.mp3';
import trombone36 from './assets/instruments/9-trombone/36.mp3';
import trombone48 from './assets/instruments/9-trombone/48.mp3';
import trombone60 from './assets/instruments/9-trombone/60.mp3';
import clarinet48 from './assets/instruments/10-clarinet/48.mp3';
import clarinet60 from './assets/instruments/10-clarinet/60.mp3';
import saxophone36 from './assets/instruments/11-saxophone/36.mp3';
import saxophone60 from './assets/instruments/11-saxophone/60.mp3';
import saxophone84 from './assets/instruments/11-saxophone/84.mp3';
import flute60 from './assets/instruments/12-flute/60.mp3';
import flute72 from './assets/instruments/12-flute/72.mp3';
import woodenFlute60 from './assets/instruments/13-wooden-flute/60.mp3';
import woodenFlute72 from './assets/instruments/13-wooden-flute/72.mp3';
import bassoon36 from './assets/instruments/14-bassoon/36.mp3';
import bassoon48 from './assets/instruments/14-bassoon/48.mp3';
import bassoon60 from './assets/instruments/14-bassoon/60.mp3';
import choir48 from './assets/instruments/15-choir/48.mp3';
import choir60 from './assets/instruments/15-choir/60.mp3';
import choir72 from './assets/instruments/15-choir/72.mp3';
import vibraphone60 from './assets/instruments/16-vibraphone/60.mp3';
import vibraphone72 from './assets/instruments/16-vibraphone/72.mp3';
import musicBox60 from './assets/instruments/17-music-box/60.mp3';
import steelDrum60 from './assets/instruments/18-steel-drum/60.mp3';
import marimba60 from './assets/instruments/19-marimba/60.mp3';
import synthLead60 from './assets/instruments/20-synth-lead/60.mp3';
import synthPad60 from './assets/instruments/21-synth-pad/60.mp3';

// Define the type for the module exports
interface InstrumentSamples {
  [key: string]: ArrayBuffer;
}

export const instrumentSamples: InstrumentSamples = {
    'instruments/1-piano/24.mp3': piano24,
    'instruments/1-piano/36.mp3': piano36,
    'instruments/1-piano/48.mp3': piano48,
    'instruments/1-piano/60.mp3': piano60,
    'instruments/1-piano/72.mp3': piano72,
    'instruments/1-piano/84.mp3': piano84,
    'instruments/1-piano/96.mp3': piano96,
    'instruments/1-piano/108.mp3': piano108,
    'instruments/2-electric-piano/60.mp3': electricPiano60,
    'instruments/3-organ/60.mp3': organ60,
    'instruments/4-guitar/60.mp3': guitar60,
    'instruments/5-electric-guitar/60.mp3': electricGuitar60,
    'instruments/6-bass/36.mp3': bass36,
    'instruments/6-bass/48.mp3': bass48,
    'instruments/7-pizzicato/60.mp3': pizzicato60,
    'instruments/8-cello/36.mp3': cello36,
    'instruments/8-cello/48.mp3': cello48,
    'instruments/8-cello/60.mp3': cello60,
    'instruments/9-trombone/36.mp3': trombone36,
    'instruments/9-trombone/48.mp3': trombone48,
    'instruments/9-trombone/60.mp3': trombone60,
    'instruments/10-clarinet/48.mp3': clarinet48,
    'instruments/10-clarinet/60.mp3': clarinet60,
    'instruments/11-saxophone/36.mp3': saxophone36,
    'instruments/11-saxophone/60.mp3': saxophone60,
    'instruments/11-saxophone/84.mp3': saxophone84,
    'instruments/12-flute/60.mp3': flute60,
    'instruments/12-flute/72.mp3': flute72,
    'instruments/13-wooden-flute/60.mp3': woodenFlute60,
    'instruments/13-wooden-flute/72.mp3': woodenFlute72,
    'instruments/14-bassoon/36.mp3': bassoon36,
    'instruments/14-bassoon/48.mp3': bassoon48,
    'instruments/14-bassoon/60.mp3': bassoon60,
    'instruments/15-choir/48.mp3': choir48,
    'instruments/15-choir/60.mp3': choir60,
    'instruments/15-choir/72.mp3': choir72,
    'instruments/16-vibraphone/60.mp3': vibraphone60,
    'instruments/16-vibraphone/72.mp3': vibraphone72,
    'instruments/17-music-box/60.mp3': musicBox60,
    'instruments/18-steel-drum/60.mp3': steelDrum60,
    'instruments/19-marimba/60.mp3': marimba60,
    'instruments/20-synth-lead/60.mp3': synthLead60,
    'instruments/21-synth-pad/60.mp3': synthPad60,
}

export const INSTRUMENT_INFO = () => {
    return [
        {
            name: formatMessage({
                id: 'music.instrumentPiano',
                default: '(1) Piano',
                description: 'Sound of a piano'
            }),
            dirName: '1-piano',
            releaseTime: 0.5,
            samples: [24, 36, 48, 60, 72, 84, 96, 108]
        },
        {
            name: formatMessage({
                id: 'music.instrumentElectricPiano',
                default: '(2) Electric Piano',
                description: 'Sound of an electric piano'
            }),
            dirName: '2-electric-piano',
            releaseTime: 0.5,
            samples: [60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentOrgan',
                default: '(3) Organ',
                description: 'Sound of an organ'
            }),
            dirName: '3-organ',
            releaseTime: 0.5,
            samples: [60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentGuitar',
                default: '(4) Guitar',
                description: 'Sound of an accoustic guitar'
            }),
            dirName: '4-guitar',
            releaseTime: 0.5,
            samples: [60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentElectricGuitar',
                default: '(5) Electric Guitar',
                description: 'Sound of an electric guitar'
            }),
            dirName: '5-electric-guitar',
            releaseTime: 0.5,
            samples: [60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentBass',
                default: '(6) Bass',
                description: 'Sound of an accoustic upright bass'
            }),
            dirName: '6-bass',
            releaseTime: 0.25,
            samples: [36, 48]
        },
        {
            name: formatMessage({
                id: 'music.instrumentPizzicato',
                default: '(7) Pizzicato',
                description: 'Sound of a string instrument (e.g. violin) being plucked'
            }),
            dirName: '7-pizzicato',
            releaseTime: 0.25,
            samples: [60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentCello',
                default: '(8) Cello',
                description: 'Sound of a cello being played with a bow'
            }),
            dirName: '8-cello',
            releaseTime: 0.1,
            samples: [36, 48, 60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentTrombone',
                default: '(9) Trombone',
                description: 'Sound of a trombone being played'
            }),
            dirName: '9-trombone',
            samples: [36, 48, 60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentClarinet',
                default: '(10) Clarinet',
                description: 'Sound of a clarinet being played'
            }),
            dirName: '10-clarinet',
            samples: [48, 60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentSaxophone',
                default: '(11) Saxophone',
                description: 'Sound of a saxophone being played'
            }),
            dirName: '11-saxophone',
            samples: [36, 60, 84]
        },
        {
            name: formatMessage({
                id: 'music.instrumentFlute',
                default: '(12) Flute',
                description: 'Sound of a flute being played'
            }),
            dirName: '12-flute',
            samples: [60, 72]
        },
        {
            name: formatMessage({
                id: 'music.instrumentWoodenFlute',
                default: '(13) Wooden Flute',
                description: 'Sound of a wooden flute being played'
            }),
            dirName: '13-wooden-flute',
            samples: [60, 72]
        },
        {
            name: formatMessage({
                id: 'music.instrumentBassoon',
                default: '(14) Bassoon',
                description: 'Sound of a bassoon being played'
            }),
            dirName: '14-bassoon',
            samples: [36, 48, 60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentChoir',
                default: '(15) Choir',
                description: 'Sound of a choir singing'
            }),
            dirName: '15-choir',
            releaseTime: 0.25,
            samples: [48, 60, 72]
        },
        {
            name: formatMessage({
                id: 'music.instrumentVibraphone',
                default: '(16) Vibraphone',
                description: 'Sound of a vibraphone being struck'
            }),
            dirName: '16-vibraphone',
            releaseTime: 0.5,
            samples: [60, 72]
        },
        {
            name: formatMessage({
                id: 'music.instrumentMusicBox',
                default: '(17) Music Box',
                description: 'Sound of a music box playing'
            }),
            dirName: '17-music-box',
            releaseTime: 0.25,
            samples: [60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentSteelDrum',
                default: '(18) Steel Drum',
                description: 'Sound of a steel drum being struck'
            }),
            dirName: '18-steel-drum',
            releaseTime: 0.5,
            samples: [60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentMarimba',
                default: '(19) Marimba',
                description: 'Sound of a marimba being struck'
            }),
            dirName: '19-marimba',
            samples: [60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentSynthLead',
                default: '(20) Synth Lead',
                description: 'Sound of a "lead" synthesizer being played'
            }),
            dirName: '20-synth-lead',
            releaseTime: 0.1,
            samples: [60]
        },
        {
            name: formatMessage({
                id: 'music.instrumentSynthPad',
                default: '(21) Synth Pad',
                description: 'Sound of a "pad" synthesizer being played'
            }),
            dirName: '21-synth-pad',
            releaseTime: 0.25,
            samples: [60]
        }
    ];
}
