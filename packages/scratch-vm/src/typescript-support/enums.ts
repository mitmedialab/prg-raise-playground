/**
 * The different kind of blocks that an extension can define
 */
export const enum BlockType {
  /**
   * Boolean reporter with hexagonal shape
   */
  Boolean = 'Boolean',

  /**
   * A button (not an actual block) for some special action, like making a variable
   */
  Button = 'button',

  /**
   * Command block
   */
  Command = 'command',

  /**
   * Specialized command block which may or may not run a child branch
   * The thread continues with the next block whether or not a child branch ran.
   */
  Conditional = 'conditional',

  /**
   * Specialized hat block with no implementation function
   * This stack only runs if the corresponding event is emitted by other code.
   */
  Event = 'event',

  /**
   * Hat block which conditionally starts a block stack
   */
  Hat = 'hat',

  /**
   * Specialized command block which may or may not run a child branch
   * If a child branch runs, the thread evaluates the loop block again.
   */
  Loop = 'loop',

  /**
   * General reporter with numeric or string value
   */
  Reporter = 'reporter'
};

export const enum ArgumentType {
  /** Numeric value with angle picker. */
  Angle = "angle",

  /** Boolean value with hexagonal placeholder. */
  Boolean = "Boolean",

  /** Numeric value with color picker. */
  Color = "color",

  /** Numeric value with text field. */
  Number = "number",

  /** String value with text field. */
  String = "string",

  /** String value with matrix field. */
  Matrix = "matrix",

  /** MIDI note number with note picker (piano) field. */
  Note = "note",

  /** Inline image on block (as part of the label). */
  Image = "image"
}

export const enum Branch {
  Exit = 0,
  Enter = 1,
  First = 1,
  Second,
  Third, 
  Fourth, 
  Fifth, 
  Sixth, 
  Seventh
}

export const enum Language {
  Аҧсшәа = 'ab',
  العربية = 'ar',
  አማርኛ = 'am',
  Azeri = 'az',
  Bahasa_Indonesia = 'id',
  Беларуская = 'be',
  Български = 'bg',
  Català = 'ca',
  Česky = 'cs',
  Cymraeg = 'cy',
  Dansk = 'da',
  Deutsch = 'de',
  Eesti = 'et',
  Ελληνικά = 'el',
  English = 'en',
  Español = 'es',
  Español_Latinoamericano = 'es-419',
  Euskara = 'eu',
  فارسی = 'fa',
  Français = 'fr',
  Gaeilge = 'ga',
  Gàidhlig = 'gd',
  Galego = 'gl',
  한국어 = 'ko',
  עִבְרִית = 'he',
  Hrvatski = 'hr',
  isiZulu = 'zu',
  Íslenska = 'is',
  Italiano = 'it',
  ქართული_ენა = 'ka',
  Kiswahili = 'sw',
  Kreyòl_ayisyen = 'ht',
  کوردیی_ناوەندی = 'ckb',
  Latviešu = 'lv',
  Lietuvių = 'lt',
  Magyar = 'hu',
  Māori = 'mi',
  Nederlands = 'nl',
  日本語 = 'ja',
  にほんご = 'ja-Hira',
  Norsk_Bokmål = 'nb',
  Norsk_Nynorsk = 'nn',
  Oʻzbekcha = 'uz',
  ไทย = 'th',
  ភាសាខ្មែរ = 'km',
  Polski = 'pl',
  Português = 'pt',
  Português_Brasileiro = 'pt-br',
  Rapa_Nui = 'rap',
  Română = 'ro',
  Русский = 'ru',
  Српски = 'sr',
  Slovenčina = 'sk',
  Slovenščina = 'sl',
  Suomi = 'fi',
  Svenska = 'sv',
  Tiếng_Việt = 'vi',
  Türkçe = 'tr',
  Українська = 'uk',
  简体中文 = 'zh-cn',
  繁體中文 = 'zh-tw'
}