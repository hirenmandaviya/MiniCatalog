import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';
import en from './locales/en.json';
import ar from './locales/ar.json';

const LANGUAGE_KEY = '@app_language';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

// Initialize i18n
const initI18n = async () => {
  let savedLanguage = 'en';
  
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (storedLanguage) {
      savedLanguage = storedLanguage;
    }
  } catch (error) {
    console.log('Error loading saved language:', error);
  }

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });

  // Set RTL for Arabic
  if (savedLanguage === 'ar') {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  } else {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }
};

export const changeLanguage = async (language: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
  await i18n.changeLanguage(language);
  
  // Update RTL
  const isRTL = language === 'ar';
  const needsRestart = I18nManager.isRTL !== isRTL;
  
  if (needsRestart) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    
    // Restart the app for RTL changes to take effect
    setTimeout(() => {
      RNRestart.restart();
    }, 500); // Small delay to allow UI feedback before restart
  }
};

export const getCurrentLanguage = () => i18n.language;

export const isRTL = () => I18nManager.isRTL;

initI18n();

export default i18n;

