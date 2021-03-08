export const convertToLegacySettingsObj = newObject => {
  const legacyObj = {
    toolbar: {
      'gurbani-options': {
        'display-visraams': newObject['display-vishraams'],
      },
      vishraam: {
        'vishraam-options': newObject['vishraam-type'],
        'vishraam-source': newObject['vishraam-source'],
      },
    },
    'slide-layout': {
      fields: {
        'display-translation': newObject['translation-visibility'],
        'display-transliteration': newObject['transliteration-visibility'],
        'display-teeka': newObject['teeka-visibility'],
        'display-next-line': newObject['display-next-line'],
      },
      'font-sizes': {
        announcements: newObject['announcements-font-size'],
        gurbani: newObject['gurbani-font-size'],
        translation: newObject['translation-font-size'],
        transliteration: newObject['transliteration-font-size'],
        teeka: newObject['teeka-font-size'],
      },
      'language-settings': {
        'translation-language': newObject['translation-language'],
        'transliteration-language': newObject['transliteration-language'],
      },
      'larivaar-settings': {
        'assist-type': newObject['larivaar-assist-type'],
      },
      'display-options': {
        larivaar: newObject.larivaar,
        'larivaar-assist': newObject['larivaar-assist'],
        'left-align': newObject['left-align'],
      },
    },
  };

  return legacyObj;
};

const legacyKeyMap = {
  displayVishraams: 'toolbar.gurbani-options.display-visraams',
  vishraamType: 'toolbar.vishraam.vishraam-options',
  vishraamSource: 'toolbar.vishraam.vishraam-source',
  translationVisibility: 'slide-layout.fields.display-translation',
  transliterationVisibility: 'slide-layout.fields.display-transliteration',
  teekaVisibility: 'slide-layout.fields.display-teeka',
  displayNextLine: 'slide-layout.fields.display-next-line',
  announcementsFontSize: 'slide-layout.font-sizes.announcements',
  gurbaniFontSize: 'slide-layout.font-sizes.gurbani',
  translationFontSize: 'slide-layout.font-sizes.translation',
  transliterationFontSize: 'slide-layout.font-sizes.transliteration',
  teekaFontSize: 'slide-layout.font-sizes.teeka',
  translationLanguage: 'slide-layout.language-settings.translation-language',
  transliterationLanguage: 'slide-layout.language-settings.transliteration-language',
  larivaarAssistType: 'slide-layout.larivaar-settings.assist-type',
  larivaar: 'slide-layout.display-options.larivaar',
  larivaarAssist: 'slide-layout.display-options.larivaar-assist',
  leftAlign: 'slide-layout.display-options.left-align',
  autoplayDelay: 'slide-layout.autoplay-options.autoplayTimer',
};

export const convertKeyToLegacySettingsObjKey = key => {
  return legacyKeyMap.hasOwnProperty(key) ? legacyKeyMap[key] : '';
};

