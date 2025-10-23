import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Product } from '../features/products/types';
import { useAppSelector, useAppDispatch } from '../store';
import { toggleFavorite, selectIsFavorite } from '../features/favorites/favoritesSlice';
import { getTheme } from '../theme';
import { selectIsDark } from '../store/themeSlice';
import ImageWithFadeIn from './ImageWithFadeIn';
import { scale as scaleSize, verticalScale } from '../utils/scale';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectIsDark);
  const isFavorite = useAppSelector(state => selectIsFavorite(state, product.id));
  const theme = getTheme(isDark);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  const handleFavoritePress = () => {
    dispatch(toggleFavorite(product.id));
  };

  const formatPrice = (price: number) => {
    return `${t('currency.symbol')} ${price.toFixed(2)}`;
  };

  const styles = createStyles(theme);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={handlePress} style={styles.card}>
        <View style={styles.imageContainer}>
          <ImageWithFadeIn uri={product.thumbnail} style={styles.image} resizeMode="cover" />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={scaleSize(24)}
              color={isFavorite ? theme.colors.error : theme.colors.textInverse}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>

          <View style={styles.ratingContainer}>
            <Icon name="star" size={scaleSize(14)} color={theme.colors.rating} />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText} numberOfLines={1}>
                {product.category}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      margin: theme.spacing.sm,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: verticalScale(150),
      backgroundColor: theme.colors.backgroundTertiary,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    favoriteButton: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderRadius: theme.borderRadius.full,
      width: scaleSize(36),
      height: scaleSize(36),
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      padding: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      height: verticalScale(40),
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    rating: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.primary,
    },
    categoryBadge: {
      backgroundColor: theme.colors.backgroundTertiary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.base,
      maxWidth: scaleSize(80),
    },
    categoryText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
  });

export default ProductCard;
