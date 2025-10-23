import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store';
import { getTheme } from '../theme';
import { selectIsDark } from '../store/themeSlice';
import { SCREENS } from '../utils/screen';
import { selectFavoriteProducts } from '../features/favorites/favoritesSlice';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

interface FavoritesListScreenProps {
  navigation: any;
}

const FavoritesListScreen: React.FC<FavoritesListScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);
  const favoriteProducts = useAppSelector(selectFavoriteProducts);

  const handleProductPress = (productId: string) => {
    navigation.navigate(SCREENS.PRODUCT_DETAILS, { productId });
  };

  const styles = createStyles(theme);

  const renderProductCard = ({ item }: any) => (
    <ProductCard product={item} onPress={() => handleProductPress(item.id)} />
  );

  if (favoriteProducts.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="heart-outline"
          title={t('favorites.emptyFavorites')}
          description={t('favorites.emptyFavoritesDesc')}
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
    <View style={styles.container}>
      <FlatList
        data={favoriteProducts}
        renderItem={renderProductCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    listContent: {
      padding: theme.spacing.sm,
    },
  });

export default FavoritesListScreen;
