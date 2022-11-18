class TranslationManager {
  constructor() {
    this.supportedExtensions = new Set();
    this.translationsByLocale = {};
  }

  addExtension(extensionInfo) {
    if (!('addTranslations') in extensionInfo) return;
    const { addTranslations } = extensionInfo;
    if (this.supportedExtensions.has(id)) return;
    addTranslations(this.translationsByLocale);
  }
}