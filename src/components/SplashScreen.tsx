import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../utils/fonts';
import { scale, verticalScale, normalizeFont } from '../utils/scale';
import { useTranslation } from 'react-i18next';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { t } = useTranslation();
  useEffect(() => {
    setTimeout(() => {
      onFinish();
    }, 1000);
  }, [onFinish]);

  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={['#6C5CE7', '#A29BFE', '#6C5CE7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Icon name="shopping" size={scale(180)} color="#FFFFFF" />
        <Text style={styles.text}>{t('common.appName')}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: scale(140),
    height: scale(140),
    borderRadius: scale(70),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(10) },
    shadowOpacity: 0.3,
    shadowRadius: scale(20),
    elevation: 10,
  },
  text: {
    fontSize: normalizeFont(40),
    fontFamily: FONTS.Bold,
    color: '#FFFFFF',
    marginTop: verticalScale(20),
  },
});

export default SplashScreen;
