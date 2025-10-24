import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector, useAppDispatch } from '../store';
import { getTheme } from '../theme';
import { selectIsDark } from '../store/themeSlice';
import { scale } from '../utils/scale';
import { SCREENS } from '../utils/screen';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartDiscount,
  selectPromoCode,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromoCode,
  removePromoCode,
} from '../features/cart/cartSlice';
import QuantityStepper from '../components/QuantityStepper';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ImageWithFadeIn from '../components/ImageWithFadeIn';
import CommonModal from '../components/CommonModal';
import { validatePromoCode } from '../utils/formatters';

interface CartScreenProps {
  navigation: any;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);

  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const total = useAppSelector(selectCartTotal);
  const discount = useAppSelector(selectCartDiscount);
  const appliedPromoCode = useAppSelector(selectPromoCode);

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message?: string;
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

  const formatPrice = (price: number) => {
    return `${t('currency.symbol')} ${price.toFixed(2)}`;
  };

  const handleRemoveItem = (productId: string) => {
    setModalConfig({
      title: t('cart.remove'),
      message: t('cart.confirmClear'),
      icon: 'delete-outline',
      iconColor: theme.colors.error,
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('cart.remove'),
          style: 'destructive',
          onPress: () => dispatch(removeFromCart(productId)),
        },
      ],
    });
    setModalVisible(true);
  };

  const handleClearCart = () => {
    setModalConfig({
      title: t('cart.clearCart'),
      message: t('cart.confirmClear'),
      icon: 'cart-remove',
      iconColor: theme.colors.error,
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('cart.clearCart'),
          style: 'destructive',
          onPress: () => dispatch(clearCart()),
        },
      ],
    });
    setModalVisible(true);
  };

  const handleCheckout = () => {
    setModalConfig({
      title: 'Checkout',
      message: 'Checkout functionality coming soon!',
      icon: 'credit-card',
      iconColor: theme.colors.success,
      buttons: [{ text: 'OK', style: 'default' }],
    });
    setModalVisible(true);
  };

  const handleApplyPromoCode = () => {
    if (!validatePromoCode(promoCodeInput.trim())) {
      setModalConfig({
        title: t('cart.invalidPromo'),
        icon: 'alert-circle',
        iconColor: theme.colors.error,
        buttons: [{ text: t('common.ok'), style: 'default' }],
      });
      setModalVisible(true);
    } else {
      dispatch(applyPromoCode(promoCodeInput.trim()));
      setPromoCodeInput('');
    }
  };

  const handleRemovePromoCode = () => {
    dispatch(removePromoCode());
  };

  const styles = createStyles(theme);

  const renderCartItem = ({ item }: any) => {
    const { product, quantity } = item;

    return (
      <View style={styles.cartItem}>
        <ImageWithFadeIn uri={product.thumbnail} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.itemPrice}>{formatPrice(product.price)}</Text>

          <View style={styles.itemFooter}>
            <QuantityStepper
              quantity={quantity}
              onIncrement={() =>
                dispatch(updateQuantity({ productId: product.id, quantity: quantity + 1 }))
              }
              onDecrement={() =>
                dispatch(updateQuantity({ productId: product.id, quantity: quantity - 1 }))
              }
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(product.id)}
              activeOpacity={0.7}
            >
              <Icon name="delete-outline" size={scale(24)} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="cart-outline"
          title={t('cart.emptyCart')}
          description={t('cart.emptyCartDesc')}
          action={
            <Button
              title={t('cart.continueShopping')}
              onPress={() => navigation.navigate(SCREENS.PRODUCTS)}
              icon="arrow-left"
              iconPosition="left"
            />
          }
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={item => item.product.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <Text style={styles.itemCount}>
                {cartItems.length} {cartItems.length === 1 ? t('cart.item') : t('cart.items')}
              </Text>
              <TouchableOpacity onPress={handleClearCart}>
                <Text style={styles.clearText}>{t('cart.clearCart')}</Text>
              </TouchableOpacity>
            </View>
          }
        />

        <View style={styles.footer}>
          {/* Promo Code */}
          {appliedPromoCode ? (
            <View style={styles.appliedPromoContainer}>
              <View style={styles.appliedPromoInfo}>
                <Icon name="tag" size={scale(20)} color={theme.colors.success} />
                <Text style={styles.appliedPromoText}>
                  {appliedPromoCode} ({Math.round(discount * 100)}% {t('cart.discount')})
                </Text>
              </View>
              <TouchableOpacity onPress={handleRemovePromoCode}>
                <Text style={styles.removePromoText}>{t('cart.removePromo')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoContainer}>
              <TextInput
                style={styles.promoInput}
                value={promoCodeInput}
                onChangeText={setPromoCodeInput}
                placeholder={t('cart.promoCodePlaceholder')}
                placeholderTextColor={theme.colors.textTertiary}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.applyPromoButton}
                onPress={handleApplyPromoCode}
                activeOpacity={0.7}
              >
                <Text style={styles.applyPromoText}>{t('cart.applyPromo')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Price Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>

            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('cart.discount')}</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -{formatPrice(subtotal * discount)}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>{t('cart.total')}</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
          </View>

          <Button
            title={t('cart.checkout')}
            onPress={handleCheckout}
            icon="credit-card"
            iconPosition="left"
            style={styles.checkoutButton}
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
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.base,
    },
    itemCount: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    clearText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.error,
    },
    listContent: {
      padding: theme.spacing.base,
    },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    itemImage: {
      width: scale(80),
      height: scale(80),
      borderRadius: theme.borderRadius.base,
      backgroundColor: theme.colors.backgroundTertiary,
    },
    itemDetails: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    itemTitle: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    itemPrice: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    itemFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    removeButton: {
      padding: theme.spacing.xs,
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
    promoContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.base,
    },
    promoInput: {
      flex: 1,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.base,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      marginRight: theme.spacing.sm,
    },
    applyPromoButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.base,
      paddingHorizontal: theme.spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    applyPromoText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.textInverse,
    },
    appliedPromoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.success + '20',
      borderRadius: theme.borderRadius.base,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.base,
    },
    appliedPromoInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    appliedPromoText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.success,
      marginLeft: theme.spacing.sm,
    },
    removePromoText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.error,
    },
    summaryContainer: {
      marginBottom: theme.spacing.base,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    summaryValue: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    discountValue: {
      color: theme.colors.success,
    },
    divider: {
      height: scale(1),
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.sm,
    },
    totalLabel: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    totalValue: {
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.primary,
    },
    checkoutButton: {
      width: '100%',
    },
  });

export default CartScreen;
