type AnimFileType = {
    file: string;
};
export const Dance = {
    Celebrate: "Celebrate",
    CircuitSaver: "Techno",
    HappyDance: "Happy Dance",
    SlowDance: "Slow Dance",
    RobotDance: "The Robot",
    Twerk: "Twerk",
    Waltz: "Waltz",
    Disco: "Disco",
} as const;
export type DanceType = typeof Dance[keyof typeof Dance];

export const danceFiles: Record<DanceType, AnimFileType> = {
    [Dance.Celebrate]: {
        file: "Dances/Celebrate_01.keys",
    },
    [Dance.CircuitSaver]: {
        file: "Dances/dance_circuit_saver_00.keys",
    },
    [Dance.HappyDance]: {
        file: "Dances/Happy_Lucky_01_01.keys",
    },
    [Dance.SlowDance]: {
        file: "Dances/Prom_Night_01_01.keys",
    },
    [Dance.RobotDance]: {
        file: "Dances/Robotic_01_01.keys",
    },
    [Dance.Twerk]: {
        file: "Dances/Twerking_01.keys",
    },
    [Dance.Waltz]: {
        file: "Dances/Waltz_01_01.keys",
    },
    [Dance.Disco]: {
        file: "Dances/dance_disco_00.keys",
    },
};

export const Emotion = {
    Frustrated: `Frustrated`,
    Laugh: `Laugh`,
    Sad: `Sad`,
    Thinking: `Thinking`,
    Happy: `Happy`,
    SadEyes: `SadEyes`,
    Curious: `Curious`,
    No: `No`,
    Yes: `Yes`,
    Puzzled: `Puzzled`,
    Success: `Success`,
} as const;
export type EmotionType = typeof Emotion[keyof typeof Emotion];

export const emotionFiles: Record<EmotionType, AnimFileType> = {
    [Emotion.Frustrated]: {
        file: "Misc/Frustrated_01_04.keys",
    },
    [Emotion.Laugh]: {
        file: "Misc/Laughter_01_03.keys",
    },
    [Emotion.Sad]: {
        file: "Misc/Sad_03.keys",
    },
    [Emotion.Thinking]: {
        file: "Misc/thinking_08.keys",
    },
    [Emotion.Happy]: {
        file: "Misc/Eye_to_Happy_02.keys",
    },
    [Emotion.SadEyes]: {
        file: "Misc/Eye_Sad_03_02.keys",
    },
    [Emotion.Curious]: {
        file: "Misc/Question_01_02.keys",
    },
    [Emotion.No]: {
        file: "Misc/no_4.keys",
    },
    [Emotion.Yes]: {
        file: "Misc/yep_02.keys",
    },
    [Emotion.Puzzled]: {
        file: "Misc/puzzled_01_02.keys",
    },
    [Emotion.Success]: {
        file: "Misc/success_02.keys",
    },
};

export const Icon = {
    Airplane: `Airplane`,
    Apple: `Apple`,
    Art: `Art`,
    Bowling: `Bowling`,
    Checkmark: `Checkmark`,
    ExclamationPoint: `ExclamationPoint`,
    Football: `Football`,
    Heart: `Heart`,
    Magic: `Magic`,
    Ocean: `Ocean`,
    Penguin: `Penguin`,
    Rainbow: `Rainbow`,
    Robot: `Robot`,
    Rocket: `Rocket`,
    Snowflake: `Snowflake`,
    Taco: `Taco`,
    VideoGame: `VideoGame`,
} as const;
export type IconType = typeof Icon[keyof typeof Icon];

export const iconFiles: Record<IconType, AnimFileType> = {
    [Icon.Airplane]: {
        file: "Emoji/Emoji_Airplane_01_01.keys",
    },
    [Icon.Apple]: {
        file: "Emoji/Emoji_AppleRed_01_01.keys",
    },
    [Icon.Art]: {
        file: "Emoji/Emoji_Art_01_01.keys",
    },
    [Icon.Bowling]: {
        file: "Emoji/Emoji_Bowling.keys",
    },
    [Icon.Checkmark]: {
        file: "Emoji/Emoji_Checkmark_01_01.keys",
    },
    [Icon.ExclamationPoint]: {
        file: "Emoji/Emoji_ExclamationYellow.keys",
    },
    [Icon.Football]: {
        file: "Emoji/Emoji_Football_01_01.keys",
    },
    [Icon.Heart]: {
        file: "Emoji/Emoji_HeartArrow_01_01.keys",
    },
    [Icon.Magic]: {
        file: "Emoji/Emoji_Magic_01_02.keys",
    },
    [Icon.Ocean]: {
        file: "Emoji/Emoji_Ocean_01_01.keys",
    },
    [Icon.Penguin]: {
        file: "Emoji/Emoji_Penguin_01_01.keys",
    },
    [Icon.Rainbow]: {
        file: "Emoji/Emoji_Rainbow_01_01.keys",
    },
    [Icon.Robot]: {
        file: "Emoji/Emoji_Robot_01_01.keys",
    },
    [Icon.Rocket]: {
        file: "Emoji/Emoji_Rocket_01_01.keys",
    },
    [Icon.Snowflake]: {
        file: "Emoji/Emoji_Snowflake_01_01.keys",
    },
    [Icon.Taco]: {
        file: "Emoji/Emoji_Taco_01_01.keys",
    },
    [Icon.VideoGame]: {
        file: "Emoji/Emoji_VideoGame_01_01.keys",
    },
};

// new audio files start
export const Audio = {
    Bawhoop: "Bawhoop",
    Bleep: "Bleep",
    Blip: "Blip",
    Bloop: "Bloop",
    BootUp: "Bubble Up",
    DoYouWantToPlay: "Robot Chitter",
    FillingUp: "Filling Up",
    PowerOn: "Power On",
    Holyhappiness: "Totter",
    ImBroken: "I'm Broken",
    PeekABoo: "Peek-A-Boo",
    Whistle: "Whistle",
    CheckmarkButton: "Checkmark",
    TurnTakingOff: "Off",
    TurnTakingOn: "On",
    Aww: "Aww",
    Confirm: "Confirm",
    Disappointed: "Disappointed",
    Hello: "Hello",
    Belly_Dance_00: "Belly Dance",
} as const;
export type AudioType = typeof Audio[keyof typeof Audio];

export const audioFiles: Record<AudioType, AnimFileType> = {
    [Audio.Bawhoop]: {
        file: "FX_Bawhoop.mp3",
    },
    [Audio.Bleep]: {
        file: "FX_Bleep.mp3",
    },
    [Audio.Blip]: {
        file: "FX_Blip.mp3",
    },
    [Audio.Bloop]: {
        file: "FX_Bloop.mp3",
    },
    [Audio.BootUp]: {
        file: "FX_BootUp.mp3",
    },
    [Audio.DoYouWantToPlay]: {
        file: "FX_DoYouWantToPlay_01.mp3",
    },
    [Audio.FillingUp]: {
        file: "FX_FillingUp_01.mp3",
    },
    [Audio.PowerOn]: {
        file: "FX_GoodJob_01.mp3",
    },
    [Audio.Holyhappiness]: {
        file: "FX_Holyhappiness.mp3",
    },
    [Audio.ImBroken]: {
        file: "FX_ImBroken_01.mp3",
    },
    [Audio.PeekABoo]: {
        file: "FX_PeekABoo_01.mp3",
    },
    [Audio.Whistle]: {
        file: "FX_Whistle.mp3",
    },
    [Audio.CheckmarkButton]: {
        file: "SFX_Global_CheckmarkButton.m4a",
    },
    [Audio.TurnTakingOff]: {
        file: "SFX_Global_TurnTakingOff.m4a",
    },
    [Audio.TurnTakingOn]: {
        file: "SFX_Global_TurnTakingOn.m4a",
    },
    [Audio.Aww]: {
        file: "SSA_aww.m4a",
    },
    [Audio.Confirm]: {
        file: "SSA_confirm.m4a",
    },
    [Audio.Disappointed]: {
        file: "SSA_disappointed.m4a",
    },
    [Audio.Hello]: {
        file: "SSA_hello.wav",
    },
    [Audio.Belly_Dance_00]: {
        file: "music/music_belly_dance_00.m4a",
    },
};