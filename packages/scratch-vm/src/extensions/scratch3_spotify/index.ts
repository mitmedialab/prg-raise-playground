/// <reference types="spotify-api" />

import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import {
    Block,
    DefineBlock,
    Environment,
    ExtensionMenuDisplayDetails,
} from "../../typescript-support/types";
import defineTranslations from "./translations";
// TODO figure out if ER used his own implementation of tone.js for a reason
import * as Tone from "tone";
import { asyncSome, fetchWithTimeout } from "../../typescript-support/utils";
import { getTimingDataFromResponse, TimingData } from "./helper";

// TODO use fetch instead of nets
const SERVER_TIMEOUT = 10000; // 10 seconds

/**
 * @summary This type describes how your extension will display in the extensions menu.
 * @description Like all Typescript type declarations, it looks and acts a lot like a javascript object.
 * It will be passed as the first generic argument to the Extension class that your specific extension `extends`
 * (see the class defintion below for more information on extending the Extension base class).
 * @see ExtensionMenuDisplayDetails for all possible display menu properties.
 * @link https://www.typescriptlang.org/docs/handbook/2/objects.html Learn more about object types! (This is specifically a 'type alias')
 * @link https://www.typescriptlang.org/docs/handbook/2/generics.html Learn more about generics!
 */
type Details = {
    name: "Spotify";
    description: "This extension plays 30 second previews of songs from Spotify. It's a resurrection of Eric Rosenbaum's https://github.com/ericrosenbaum/spotify-extension/blob/gh-pages/extension.js";
    /**
     * IMPORTANT! Place your icon image (typically a png) in the same directory as this index.ts file
     */
    iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)";
    /**
     * IMPORTANT! Place your inset icon image (typically an svg) in the same directory as this index.ts file
     * NOTE: This icon will also appear on all of your extension's blocks
     */
    insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)";
};

/**
 * @summary This type describes all of the blocks your extension will/does implement.
 * @description As you can see, each block is represented as a function.
 * In typescript, you can specify a function in either of the following ways (and which you choose is a matter of preference):
 * - Arrow syntax: `nameOfFunction: (argument1Name: argument1Type, argument2Name: argument2Type, ...etc...) => returnType;`
 * - 'Method' syntax: `nameOfFunction(argument1Name: argument1Type, argument2Name: argument2Type, ...etc...): returnType;`
 *
 * The three included functions demonstrate some of the most common types of blocks: commands, reporters, and hats.
 * - Command functions/blocks take 0 or more arguments, and return nothing (indicated by the use of a `void` return type).
 * - Reporter functions/blocks also take 0 or more arguments, but they must return a value (likely a `string` or `number`).
 * - Hat functions/blocks also take 0 or more arguments, but they must return a boolean value.
 *
 * Feel free to delete these once you're ready to implement your own blocks.
 *
 * This type will be passed as the second generic argument to the Extension class that your specific extension 'extends'
 * (see the class defintion below for more information on extending the Extension base class).
 * @link https://www.typescriptlang.org/docs/handbook/2/functions.html Learn more about function types!
 * @link https://www.typescriptlang.org/docs/handbook/2/objects.html Learn more about object types! (This is specifically a 'type alias')
 * @link https://www.typescriptlang.org/docs/handbook/2/generics.html Learn more about generics!
 */
type Blocks = {
    searchAndPlay(query: string): void;
    searchAndPlayWait(query: string): void;
    trackData(trackAttr: string): string;
    stopMusic(): void;
    musicStopped(): boolean;
    everyBeat(): boolean;
    everyBar(): boolean;
    // leaving out fancy blocks that allow mixing for now
    /* playNextBeat(): void;
    playBeat(beatNum: number): void;
    playBeatAndWait(beatNum: number): void;
    currentBeat(): number; */
};

/**
 * @summary This is the class responsible for implementing the functionality of your blocks.
 * @description You'll notice that this class `extends` (or 'inherits') from the base `Extension` class.
 *
 * Hover over `Extension` to get a more in depth explanation of the base class, and what it means to `extend it`.
 */
class Spotify extends Extension<Details, Blocks> {
    /**
     * @summary A field to demonstrate how Typescript Class fields work
     * @link https://www.typescriptlang.org/docs/handbook/2/classes.html#fields
     */
    prevQuery: string = "";
    currentArtistName: string = "no artist";
    currentTrackName: string = "no track";
    currentAlbumName: string = "no album";

    spotifyToken: AccessToken;

    /**
     *  player for playing entire track
     */
    player: Tone.Player = new Tone.Player().toDestination();

    gain: Tone.Gain = new Tone.Gain();
    audioContext: Tone.BaseContext = Tone.context;

    /**
     *  beat players for playing individual beat at a time
     */
    beatPlayers: Tone.Player[] = [];
    trackTimingData: TimingData;
    beatTimeouts: NodeJS.Timeout[] = [];
    barTimeouts: NodeJS.Timeout[] = [];
    trackTimeout: NodeJS.Timeout;
    trackStartTime: number;

    currentBeatPlayerIndex: number = 0;
    currentBeatNum: number = 0;
    beatFlag: boolean = false;
    barFlag: boolean = false;
    songFlag: boolean = false;
    currentTrackDuration: number = 0;
    trackTempo: number = 0;
    numBeats: number = 0;

    resolvePlayUntil: (value: void | PromiseLike<void>) => void;

    async init(env: Environment) {
        const options = { attack: 0.1, decay: 0, sustain: 1.0, release: 0.01 };
        for (let i = 0; i < 4; i++) {
            const beatPlayer = new Tone.Player();
            const ampEnv = new Tone.AmplitudeEnvelope(options).toDestination();
            beatPlayer.connect(ampEnv);
            this.beatPlayers.push(beatPlayer);
        }

        Tone.Destination.chain(this.gain);

        this.spotifyToken = await getAccessToken();

        env.onStopSign(this.stopMusic);
    }

    // Ignore! Translations coming soon...
    defineTranslations = defineTranslations as typeof this.defineTranslations;

    playTrack() {
        const { player, trackTimingData, currentTrackDuration } = this;
        if (!player.buffer || !player.buffer.loaded || !trackTimingData) return;
        const now = Tone.now();
        player.start(now, 0, currentTrackDuration);
        this.trackStartTime = now;
        this.songFlag = true;
        this.setupTimeouts();
    }

    clearTimeouts() {
        clearTimeout(this.trackTimeout);
        this.beatTimeouts.forEach(clearTimeout);
        this.barTimeouts.forEach(clearTimeout);
    }

    resetTrackData() {
        this.player = new Tone.Player().toDestination();
        this.currentArtistName = "no artist";
        this.currentTrackName = "no track";
        this.currentAlbumName = "no album";
        this.trackTempo = 0;
    }

    async requestSearch(query: string) {
        this.player.stop();
        this.clearTimeouts();

        if (query == "") return;
        this.currentBeatNum = 0;

        const sameQuery = query === this.prevQuery;
        if (sameQuery) return;

        const url = `https://api.spotify.com/v1/search?q=${query}&type=track`;
        const headers = { Authorization: "Bearer " + this.spotifyToken.value };

        const response = await fetchWithTimeout(url, { headers, timeout: SERVER_TIMEOUT });

        if (!response.ok) console.log(`Error with Spotify API query: ${response}`);

        const { status } = response;
        const json: SpotifyApi.TrackSearchResponse = await response.json();

        const success = status === 200

        if (!success) {
            console.log(`Error with Spotify API query: ${json}`);
            const tokenExpired = status === 401;

            if (!tokenExpired) return console.error(`Spotify token error: ${status}`);

            console.log("401 error");
            const newToken = await getAccessToken();
            this.spotifyToken = newToken;
            return;
        }

        this.prevQuery = query;
        const trackObjects = json.tracks.items;

        const noTracksFound = !trackObjects || trackObjects.length === 0;
        if (noTracksFound) return this.resetTrackData();

        const nonExplicitSongs = trackObjects.filter(track => !track.explicit);

        if (nonExplicitSongs.length === 0) {
            this.resetTrackData();
            return console.log("no results without explicit lyrics");
        }

        const timingFound = await asyncSome(nonExplicitSongs, this.tryGetTimingData.bind(this));

        if (!timingFound) {
            console.log("no more results");
            this.resetTrackData();
        }
    };

    async tryGetTimingData({ artists, name, album, preview_url }: SpotifyApi.TrackObjectFull) {
        const success = await this.tryGetTrackTimingData(preview_url);

        if (!success) {
            console.log(`No timing data for ${name}.`);
            return false;
        }

        this.currentArtistName = artists[0].name;
        this.currentTrackName = name;
        this.currentAlbumName = album.name;
        return true;
    }

    async tryGetTrackTimingData(url: string) {
        if (!url) return false;
        const response = await fetch(url);

        this.trackTimingData = await getTimingDataFromResponse(response);

        if (!this.trackTimingData) return false;

        const { beats, loop_duration, buffer } = this.trackTimingData;

        let sum = 0;
        for (let i = 0; i < beats.length - 1; i++) {
            sum += beats[i + 1] - beats[i];
        }

        const averageBeatLength = sum / (beats.length - 1);
        const tempoEstimate = 60 / averageBeatLength;
        this.trackTempo = tempoEstimate;

        // use the loop duration to set the number of beats
        const durationLessThanBeat = () => ({ beat }: { beat: number }) => loop_duration < beat;
        const { index } = beats.map((beat, index) => ({ beat, index })).find(durationLessThanBeat);
        this.numBeats = index;

        await this.audioContext.rawContext.decodeAudioData(
            buffer.buffer,
            (audioBuffer) => {
                const { player, beatPlayers } = this;
                player.buffer.set(audioBuffer);
                this.currentTrackDuration = loop_duration;
                beatPlayers.forEach(({ buffer }) => buffer.set(audioBuffer));
            }
        );

        return true;
    }

    setupTimeouts() {
        const { numBeats, trackTimingData } = this;
        const { beats, downbeats } = trackTimingData;

        // events on each beat
        this.beatTimeouts = [];
        for (let i = 0; i < numBeats; i++) {
            const callback = (value: number) => {
                this.beatFlag = true;
                this.currentBeatNum = value;
            }
            const duration = (beats[i] - 0.1) * 1000;
            const timeout = setTimeout(callback.bind(this), duration, i);
            this.beatTimeouts.push(timeout);
        }

        // events on each bar
        this.barTimeouts = [];
        for (let i = 0; i < downbeats.length; i++) {
            if (downbeats[i] < beats[numBeats - 1]) {
                const duration = (downbeats[i] - 0.1) * 1000;
                const timeout = setTimeout(() => this.barFlag = true, duration);
                this.barTimeouts.push(timeout);
            }
        }
    }

    stopMusic() {
        this.player.stop();
        this.clearTimeouts();
        this.songFlag = false;
        if (this.resolvePlayUntil) this.resolvePlayUntil();
    }

    defineBlocks(): Spotify["BlockDefinitions"] {
        return {
            searchAndPlay: searchAndPlay,
            searchAndPlayWait: searchAndPlayWait,
            stopMusic: stopMusic,
            musicStopped: musicStopped,
            everyBeat: everyBeat,
            everyBar: everyBar,
            trackData: getTrackData,
            // leaving out fancy blocks that allow mixing for now
            /*playNextBeat: playNextBeat,
            playBeat: playBeat,
            playBeatAndWait: playBeatAndWait,
            currentBeat: getCurrentBeat, */
        };
    }
}

const currentTimeSec = (): number => {
    return new Date().getTime() / 1000;
};

type AccessToken = {
    expirationTime: number;
    value: string;
};

const getAccessToken = async (): Promise<AccessToken> => {
    const url = "https://u61j2fb017.execute-api.us-east-1.amazonaws.com/prod/get-spotify-token";
    const response = await fetchWithTimeout(url, { timeout: SERVER_TIMEOUT });

    if (!response.ok) {
        console.error(`Spotify token error: ${response}`);
        return undefined;
    }

    const { status } = response;
    const success = status === 200;

    if (!success) {
        console.error(`Spotify token error ${status}: ${response.statusText}`);
        return undefined;
    }

    const { token }: { token: string } = await response.json();

    return { expirationTime: currentTimeSec() + 3600, value: token };
};

const refreshAccessTokenIfNeeded = (
    token: AccessToken
): Promise<AccessToken> => {
    return new Promise((resolve, reject) => {
        if (currentTimeSec() > token.expirationTime) {
            getAccessToken().then((newToken) => {
                token = newToken;
                console.log("token expired, got a new one");
                resolve(token);
            });
        } else {
            resolve(token);
        }
    });
};

type SearchAndPlayBlock = Blocks["searchAndPlay"];
const searchAndPlay = (extension: Spotify): Block<SearchAndPlayBlock> => ({
    type: BlockType.Command,
    arg: { type: ArgumentType.String, defaultValue: "tacos" },
    text: (searchQuery) => `play music like ${searchQuery}`,
    operation: async function (searchQuery) {
        let token = await refreshAccessTokenIfNeeded(extension.spotifyToken);
        extension.spotifyToken = token;
        await extension.requestSearch(searchQuery);
        await extension.playTrack();

        setTimeout(() => {
            extension.songFlag = false;
        }, extension.currentTrackDuration * 1000);
    },
});

type SearchAndPlayWaitBlock = Blocks["searchAndPlayWait"];
const searchAndPlayWait = (extension: Spotify): Block<SearchAndPlayWaitBlock> => ({
    type: BlockType.Command,
    arg: { type: ArgumentType.String, defaultValue: "lauryn hill" },
    text: (searchQuery) => `play music like ${searchQuery} until done`,
    operation: async function (searchQuery) {
        let token = await refreshAccessTokenIfNeeded(extension.spotifyToken);
        extension.spotifyToken = token;
        await extension.requestSearch(searchQuery);
        await extension.playTrack();

        return new Promise<void>((resolve) => {
            extension.resolvePlayUntil = resolve;
            setTimeout(extension.resolvePlayUntil, extension.currentTrackDuration * 1000);
        });
    },
});

type StopMusicBlock = Blocks["stopMusic"];
const stopMusic = (extension: Spotify): Block<StopMusicBlock> => ({
    type: BlockType.Command,
    text: `stop the music`,
    operation: extension.stopMusic,
});

type TrackData = Blocks["trackData"];
const getTrackData = (): Block<TrackData> => ({
    type: BlockType.Reporter,
    arg: {
        type: ArgumentType.String,
        defaultValue: "full",
        options: ["track", "artist", "album", "full"],
    },
    text: (requestedData) => `${requestedData} name`,
    operation: function (requestedData) {
        switch (requestedData) {
            case "track":
                return this.currentTrackName;
            case "artist":
                return this.currentArtistName;
            case "album":
                return this.currentAlbumName;
            case "full":
                return `${this.currentTrackName} by ${this.currentArtistName} from ${this.currentAlbumName}`;
            default:
                return "";
        }
    },
});

type EveryBeat = Blocks["everyBeat"];
const everyBeat = (extension: Spotify): Block<EveryBeat> => ({
    type: BlockType.Hat,
    text: `every beat`,
    operation: function () {
        console.log("Every beat");
        if (extension.beatFlag) setTimeout(() => extension.beatFlag = false, 60);
        return extension.beatFlag;
    },
});

type EveryBar = Blocks["everyBar"];
const everyBar = (extension: Spotify): Block<EveryBar> => ({
    type: BlockType.Hat,
    text: `every 4 beats`,
    operation: function () {
        if (extension.barFlag) setTimeout(() => extension.barFlag = false, 60);
        return extension.barFlag;
    },
});

type MusicStopped = Blocks["musicStopped"];
const musicStopped = (extension: Spotify): Block<MusicStopped> => ({
    type: BlockType.Boolean,
    text: `music stopped?`,
    operation: () => !extension.songFlag,
});

export = Spotify;
