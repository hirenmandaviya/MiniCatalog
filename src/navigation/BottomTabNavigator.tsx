import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../store';
import { getTheme } from '../theme';
import { selectIsDark } from '../store/themeSlice';
import { selectCartItemsCount } from '../features/cart/cartSlice';
import { selectFavoritesCount } from '../features/favorites/favoritesSlice';
import { SCREENS } from '../utils/screen';
import ProductListScreen from '../screens/ProductListScreen';
import FavoritesListScreen from '../screens/FavoritesListScreen';
import CartScreen from '../screens/CartScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { scale, verticalScale, normalizeFont } from '../utils/scale';

const Tab = createBottomTabNavigator();

const Badge: React.FC<{ count: number; theme: any }> = ({ count, theme }) => {
  if (count === 0) return null;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: theme.colors.error, borderColor: theme.colors.surface },
      ]}
    >
      <Text style={[styles.badgeText, { color: theme.colors.textInverse }]}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

const BottomTabNavigator: React.FC = () => {
  const { t } = useTranslation();
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);
  const cartCount = useAppSelector(selectCartItemsCount);
  const favoritesCount = useAppSelector(selectFavoritesCount);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 4,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.bold,
          fontSize: theme.typography.fontSize.xl,
          color: theme.colors.text,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          elevation: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: verticalScale(-2) },
          shadowOpacity: 0.1,
          shadowRadius: scale(8),
          height: verticalScale(65),
          paddingBottom: verticalScale(8),
          paddingTop: verticalScale(8),
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: theme.typography.fontSize.xs,
        },
      }}
    >
      <Tab.Screen
        name={SCREENS.PRODUCTS}
        component={ProductListScreen}
        options={{
          title: t('products.title'),
          tabBarLabel: t('products.title'),
          tabBarIcon: ({ color, size }) => <Icon name="shopping" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name={SCREENS.FAVORITES}
        component={FavoritesListScreen}
        options={{
          title: t('favorites.title'),
          tabBarLabel: t('favorites.title'),
          tabBarIcon: ({ color, size }) => (
            <View>
              <Icon name="heart" size={size} color={color} />
              <Badge count={favoritesCount} theme={theme} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.CART}
        component={CartScreen}
        options={{
          title: t('cart.title'),
          tabBarLabel: t('cart.title'),
          tabBarIcon: ({ color, size }) => (
            <View>
              <Icon name="cart" size={size} color={color} />
              <Badge count={cartCount} theme={theme} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.SETTINGS}
        component={SettingsScreen}
        options={{
          title: t('settings.title'),
          tabBarLabel: t('settings.title'),
          tabBarIcon: ({ color, size }) => <Icon name="cog" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: verticalScale(-4),
    right: scale(-10),
    minWidth: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(4),
    borderWidth: scale(2),
  },
  badgeText: {
    fontSize: normalizeFont(10),
    fontWeight: 'bold',
  },
});

export default BottomTabNavigator;
