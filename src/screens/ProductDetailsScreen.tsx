import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector, useAppDispatch } from '../store';
import { getTheme } from '../theme';
import { selectIsDark } from '../store/themeSlice';
import { scale, verticalScale } from '../utils/scale';
import { SCREENS } from '../utils/screen';
import { selectProductById } from '../features/products/productsSlice';
import { addToCart, selectIsInCart } from '../features/cart/cartSlice';
import { toggleFavorite, selectIsFavorite } from '../features/favorites/favoritesSlice';
import ImageCarousel from '../components/ImageCarousel';
import QuantityStepper from '../components/QuantityStepper';
import Button from '../components/Button';
import CommonModal from '../components/CommonModal';

interface ProductDetailsScreenProps {
  route: any;
  navigation: any;
}

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ route, navigation }) => {
  const { productId } = route.params;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);

  const product = useAppSelector(state => selectProductById(state, productId));
  const isInCart = useAppSelector(state => selectIsInCart(state, productId));
  const isFavorite = useAppSelector(state => selectIsFavorite(state, productId));

  const [quantity, setQuantity] = useState(1);
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

  const styles = createStyles(theme);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setModalConfig({
      title: t('productDetails.addedToCart'),
      message: `${product.title} ${t('productDetails.addedToCart')}`,
      icon: 'cart-check',
      iconColor: theme.colors.success,
      buttons: [
        { text: t('cart.continueShopping'), style: 'cancel' },
        {
          text: t('cart.title'),
          onPress: () => {
            navigation.navigate(SCREENS.MAIN, { screen: SCREENS.CART });
          },
          style: 'default',
        },
      ],
    });
    setModalVisible(true);
    setQuantity(1);
  };

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(productId));
  };

  const formatPrice = (price: number) => {
    return `${t('currency.symbol')} ${price.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel images={product.images} height={verticalScale(350)} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{product.title}</Text>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleFavoriteToggle}
                activeOpacity={0.7}
              >
                <Icon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={scale(28)}
                  color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={scale(18)} color={theme.colors.rating} />
                <Text style={styles.rating}>
                  {product.rating.toFixed(1)} {t('productDetails.rating')}
                </Text>
              </View>

              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>{t('productDetails.price')}</Text>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('productDetails.description')}</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>{t('productDetails.quantity')}</Text>
            <QuantityStepper
              quantity={quantity}
              onIncrement={() => setQuantity(q => q + 1)}
              onDecrement={() => setQuantity(q => q - 1)}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>{t('cart.total')}</Text>
          <Text style={styles.totalPrice}>{formatPrice(product.price * quantity)}</Text>
        </View>
        <Button
          title={isInCart ? t('cart.updateQuantity') : t('productDetails.addToCart')}
          onPress={handleAddToCart}
          icon="cart-plus"
          iconPosition="left"
          style={styles.addToCartButton}
        />
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
    },
    content: {
      padding: theme.spacing.base,
    },
    header: {
      marginBottom: theme.spacing.base,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    title: {
      flex: 1,
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginRight: theme.spacing.sm,
    },
    favoriteButton: {
      padding: theme.spacing.xs,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rating: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    categoryBadge: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.base,
    },
    categoryText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.primary,
      textTransform: 'capitalize',
    },
    priceSection: {
      marginBottom: theme.spacing.base,
    },
    priceLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    price: {
      fontSize: theme.typography.fontSize['3xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.primary,
    },
    divider: {
      height: scale(1),
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.base,
    },
    section: {
      marginBottom: theme.spacing.base,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    description: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.relaxed,
    },
    quantitySection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.base,
    },
    footer: {
      padding: theme.spacing.base,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      elevation: 8,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    totalLabel: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    totalPrice: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
    },
    addToCartButton: {
      width: '100%',
    },
    errorText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      textAlign: 'center',
      marginTop: theme.spacing.base,
    },
  });

export default ProductDetailsScreen;
