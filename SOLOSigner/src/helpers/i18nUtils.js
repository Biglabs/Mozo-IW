//
//  i18nUtils.js
//  Solo Signer
//
//  Created by Hoang Nguyen on 8/6/18.
//
import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

// Import all locales
import en from '../../locales/en.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en,
};

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

/**
 * The method we'll use instead of a regular string
 * @param {String} A path to the locale string in the JSON file. 
 * @param {String} Parameters we could use in the localized string. 
 */
export function strings(name, params = {}) {
  return I18n.t(name, params);
};

export default I18n;