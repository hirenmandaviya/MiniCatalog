import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector, useAppDispatch } from '../store';
import { getTheme } from '../theme';
import { selectIsDark, toggleTheme } from '../store/themeSlice';
import { changeLanguage, getCurrentLanguage } from '../i18n';
import CommonModal from '../components/CommonModal';

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);
  const currentLanguage = getCurrentLanguage();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    icon?: string;
    iconColor?: string;
    buttons: Array<{
      text: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }>;
  }>({
    title: '',
    message: '',
    buttons: [],
  });

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleChangeLanguage = async () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';

    setModalConfig({
      title: t('settings.language'),
      message: `${t('settings.changeLanguageTo')} ${
        newLanguage === 'en' ? t('settings.english') : t('settings.arabic')
      }?`,
      icon: 'translate',
      iconColor: theme.colors.primary,
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'default',
          onPress: async () => {
            // Show restarting message
            setModalConfig({
              title: t('settings.language'),
              message: t('settings.restartingApp') || 'Restarting app...',
              icon: 'restart',
              iconColor: theme.colors.primary,
              buttons: [],
            });
            setModalVisible(true);

            // Change language (will trigger automatic restart)
            await changeLanguage(newLanguage);
          },
        },
      ],
    });
    setModalVisible(true);
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon
              name={isDark ? 'weather-night' : 'white-balance-sunny'}
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.settingLabel}>
              {isDark ? t('settings.darkMode') : t('settings.lightMode')}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleToggleTheme}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.surface}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleChangeLanguage}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Icon name="translate" size={24} color={theme.colors.primary} />
            <Text style={styles.settingLabel}>
              {currentLanguage === 'en' ? t('settings.english') : t('settings.arabic')}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.about')}</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="information" size={24} color={theme.colors.primary} />
            <Text style={styles.settingLabel}>{t('settings.version')}</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>
      </View>

      <CommonModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        icon={modalConfig.icon}
        iconColor={modalConfig.iconColor}
        buttons={modalConfig.buttons}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.base,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      marginBottom: theme.spacing.md,
      marginLeft: theme.spacing.xs,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.base,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingLabel: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
    },
    versionText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
  });

export default SettingsScreen;
