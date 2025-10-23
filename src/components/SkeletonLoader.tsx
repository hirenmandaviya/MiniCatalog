import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAppSelector } from '../store';
import { getTheme } from '../theme';
import { selectIsDark } from '../store/themeSlice';
import { scale, verticalScale } from '../utils/scale';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = verticalScale(20),
  borderRadius = scale(4),
  style,
}) => {
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 800 }), withTiming(0.3, { duration: 800 })),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const styles = createStyles(theme);

  return (
    <Animated.View
      style={[styles.skeleton, { width, height, borderRadius }, animatedStyle, style]}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);
  const styles = createStyles(theme);

  return (
    <View style={styles.cardSkeleton}>
      <SkeletonLoader height={verticalScale(150)} borderRadius={theme.borderRadius.lg} />
      <View style={styles.cardSkeletonContent}>
        <SkeletonLoader height={verticalScale(16)} style={{ marginBottom: theme.spacing.sm }} />
        <SkeletonLoader
          width="60%"
          height={verticalScale(14)}
          style={{ marginBottom: theme.spacing.sm }}
        />
        <View style={styles.cardSkeletonFooter}>
          <SkeletonLoader width={scale(80)} height={verticalScale(20)} />
          <SkeletonLoader
            width={scale(60)}
            height={verticalScale(24)}
            borderRadius={theme.borderRadius.base}
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    skeleton: {
      backgroundColor: theme.colors.backgroundTertiary,
    },
    cardSkeleton: {
      margin: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    cardSkeletonContent: {
      padding: theme.spacing.md,
    },
    cardSkeletonFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

export default SkeletonLoader;
