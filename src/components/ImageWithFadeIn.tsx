import React, { useState } from 'react';
import { Image, ImageProps, StyleSheet, View, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAppSelector } from '../store';
import { getTheme } from '../theme';
import { selectIsDark } from '../store/themeSlice';

interface ImageWithFadeInProps extends Omit<ImageProps, 'onLoad' | 'onLoadStart'> {
  uri: string;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  placeholderColor?: string;
  showLoader?: boolean;
}

const ImageWithFadeIn: React.FC<ImageWithFadeInProps> = ({
  uri,
  style,
  resizeMode = 'cover',
  placeholderColor,
  showLoader = true,
  ...props
}) => {
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
    opacity.value = 0;
  };

  const handleLoad = () => {
    setIsLoading(false);
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.ease,
    });
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const styles = createStyles(theme, placeholderColor);

  return (
    <View style={[styles.container, style]}>
      {/* Placeholder/Loading state */}
      {(isLoading || hasError) && (
        <View style={[styles.placeholder, style]}>
          {isLoading && showLoader && (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          )}
        </View>
      )}

      {/* Actual Image */}
      {!hasError && (
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image
            {...props}
            source={{ uri }}
            style={[styles.image, style]}
            resizeMode={resizeMode}
            onLoadStart={handleLoadStart}
            onLoad={handleLoad}
            onError={handleError}
          />
        </Animated.View>
      )}
    </View>
  );
};

const createStyles = (theme: any, placeholderColor?: string) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      overflow: 'hidden',
    },
    placeholder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: placeholderColor || theme.colors.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      width: '100%',
      height: '100%',
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });

export default ImageWithFadeIn;
