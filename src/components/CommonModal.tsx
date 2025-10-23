import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal as RNModal,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector } from '../store';
import { getTheme } from '../theme';
import { selectIsDark } from '../store/themeSlice';
import { scale, verticalScale } from '../utils/scale';

const { width } = Dimensions.get('window');

export interface ModalButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CommonModalProps {
  visible: boolean;
  title: string;
  message?: string;
  icon?: string;
  iconColor?: string;
  buttons?: ModalButton[];
  onClose?: () => void;
}

const CommonModal: React.FC<CommonModalProps> = ({
  visible,
  title,
  message,
  icon,
  iconColor,
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
}) => {
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200, easing: Easing.ease });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      opacity.value = withTiming(0, { duration: 150, easing: Easing.ease });
      scale.value = withTiming(0, { duration: 150, easing: Easing.ease });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleButtonPress = (button: ModalButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  };

  const getButtonStyle = (buttonStyle?: string) => {
    switch (buttonStyle) {
      case 'cancel':
        return styles.cancelButton;
      case 'destructive':
        return styles.destructiveButton;
      default:
        return styles.defaultButton;
    }
  };

  const getButtonTextStyle = (buttonStyle?: string) => {
    switch (buttonStyle) {
      case 'cancel':
        return [styles.buttonText, { color: theme.colors.textSecondary }];
      case 'destructive':
        return [styles.buttonText, { color: theme.colors.error }];
      default:
        return [styles.buttonText, { color: theme.colors.textInverse }];
    }
  };

  const styles = createStyles(theme);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <View style={[styles.modalContainer]}>
          {icon && (
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: iconColor ? iconColor + '20' : theme.colors.primary + '20' },
                ]}
              >
                <Icon name={icon} size={40} color={iconColor || theme.colors.primary} />
              </View>
            </View>
          )}

          <Text style={styles.title}>{title}</Text>

          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  getButtonStyle(button.style),
                  (buttons.length === 1 ||
                    (index === buttons.length - 1 && button.style === 'default')) &&
                    styles.singleButton,
                ]}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.7}
              >
                <Text style={getButtonTextStyle(button.style)}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    </RNModal>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.base,
    },
    modalContainer: {
      width: width - scale(60),
      maxWidth: scale(400),
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      alignItems: 'center',
      elevation: 10,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: verticalScale(10) },
      shadowOpacity: 0.3,
      shadowRadius: scale(20),
    },
    iconContainer: {
      marginBottom: theme.spacing.base,
    },
    iconCircle: {
      width: scale(80),
      height: scale(80),
      borderRadius: scale(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    message: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: theme.typography.fontSize.md * 1.5,
      marginBottom: theme.spacing.lg,
    },
    buttonContainer: {
      flexDirection: 'row',
      width: '100%',
      gap: theme.spacing.sm,
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.base,
      borderRadius: theme.borderRadius.base,
      alignItems: 'center',
      justifyContent: 'center',
    },
    singleButton: {
      backgroundColor: theme.colors.primary,
    },
    defaultButton: {
      backgroundColor: theme.colors.backgroundSecondary,
    },
    cancelButton: {
      backgroundColor: theme.colors.backgroundSecondary,
    },
    destructiveButton: {
      backgroundColor: theme.colors.error + '20',
    },
    buttonText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
  });

export default CommonModal;
