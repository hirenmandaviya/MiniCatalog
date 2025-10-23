import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector } from '../store';
import { getTheme } from '../theme';
import { selectIsDark } from '../store/themeSlice';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);
  const styles = createStyles(theme);

  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    const baseStyles: any[] = [
      styles.button,
      styles[`button_${variant}`],
      styles[`button_${size}`],
    ];
    if (isDisabled) {
      baseStyles.push(styles.button_disabled);
    }
    if (style) {
      baseStyles.push(style);
    }
    return baseStyles;
  };

  const getTextStyle = () => {
    const baseStyles: any[] = [styles.text, styles[`text_${variant}`], styles[`text_${size}`]];
    if (textStyle) {
      baseStyles.push(textStyle);
    }
    return baseStyles;
  };

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const iconColor = variant === 'outline' ? theme.colors.primary : theme.colors.textInverse;

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? theme.colors.primary : theme.colors.textInverse}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Icon name={icon} size={iconSize} color={iconColor} style={styles.iconLeft} />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Icon name={icon} size={iconSize} color={iconColor} style={styles.iconRight} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadius.base,
    },
    button_primary: {
      backgroundColor: theme.colors.primary,
    },
    button_secondary: {
      backgroundColor: theme.colors.secondary,
    },
    button_outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    button_small: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    button_medium: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    button_large: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.base,
    },
    button_disabled: {
      opacity: 0.5,
    },
    text: {
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    text_primary: {
      color: theme.colors.textInverse,
    },
    text_secondary: {
      color: theme.colors.textInverse,
    },
    text_outline: {
      color: theme.colors.primary,
    },
    text_small: {
      fontSize: theme.typography.fontSize.sm,
    },
    text_medium: {
      fontSize: theme.typography.fontSize.md,
    },
    text_large: {
      fontSize: theme.typography.fontSize.lg,
    },
    iconLeft: {
      marginRight: theme.spacing.sm,
    },
    iconRight: {
      marginLeft: theme.spacing.sm,
    },
  });

export default Button;
