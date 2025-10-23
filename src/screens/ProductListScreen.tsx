import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector, useAppDispatch } from '../store';
import { getTheme } from '../theme';
import { selectIsDark } from '../store/themeSlice';
import { scale, verticalScale } from '../utils/scale';
import { SCREENS } from '../utils/screen';
import {
  fetchProducts,
  selectFilteredProducts,
  selectProductsLoading,
  selectProductsError,
  selectSearchQuery,
  selectSelectedCategory,
  selectCategories,
  setSearchQuery,
  setSelectedCategory,
  clearFilters,
} from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import Button from '../components/Button';

interface ProductListScreenProps {
  navigation: any;
}

const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);

  const products = useAppSelector(selectFilteredProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const categories = useAppSelector(selectCategories);

  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Debounce search query
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [localSearchQuery, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
  };

  const handleRetry = () => {
    dispatch(fetchProducts());
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate(SCREENS.PRODUCT_DETAILS, { productId });
  };

  const handleSearch = (text: string) => {
    setLocalSearchQuery(text);
  };

  const handleCategorySelect = (category: string | null) => {
    dispatch(setSelectedCategory(category));
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalSearchQuery('');
  };

  const styles = createStyles(theme);

  const renderProductCard = ({ item }: any) => (
    <ProductCard product={item} onPress={() => handleProductPress(item.id)} />
  );

  const renderSkeletonLoader = () => <ProductCardSkeleton />;

  const renderHeader = () => (
    <View style={styles.header}>
      <SearchBar value={localSearchQuery} onChangeText={handleSearch} style={styles.searchBar} />
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(true)}
        activeOpacity={0.7}
      >
        <Icon name="filter-variant" size={scale(24)} color={theme.colors.primary} />
        {(selectedCategory || searchQuery) && <View style={styles.filterBadge} />}
      </TouchableOpacity>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('common.filter')}</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)} style={styles.closeButton}>
              <Icon name="close" size={scale(24)} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>{t('products.category')}</Text>

          <TouchableOpacity
            style={[styles.categoryItem, !selectedCategory && styles.categoryItemActive]}
            onPress={() => handleCategorySelect(null)}
          >
            <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
              {t('products.allCategories')}
            </Text>
          </TouchableOpacity>

          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryItem,
                selectedCategory === category && styles.categoryItemActive,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.modalActions}>
            <Button
              title={t('common.clear')}
              onPress={handleClearFilters}
              variant="outline"
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  if (error && products.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <ErrorState error={error} onRetry={handleRetry} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      {loading && products.length === 0 ? (
        <FlatList
          data={Array.from({ length: 10 })}
          renderItem={renderSkeletonLoader}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon="package-variant-closed"
          title={t('products.noProducts')}
          description={t('products.noProductsDesc')}
          action={
            <Button title={t('common.clear')} onPress={handleClearFilters} variant="primary" />
          }
        />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}

      {renderFilterModal()}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.base,
      backgroundColor: theme.colors.surface,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    searchBar: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    filterButton: {
      width: scale(48),
      height: scale(48),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.base,
      position: 'relative',
    },
    filterBadge: {
      position: 'absolute',
      top: verticalScale(8),
      right: scale(8),
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
      backgroundColor: theme.colors.error,
    },
    listContent: {
      padding: theme.spacing.sm,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    modalTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      textTransform: 'uppercase',
    },
    categoryItem: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.base,
      borderRadius: theme.borderRadius.base,
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.backgroundSecondary,
    },
    categoryItemActive: {
      backgroundColor: theme.colors.primary,
    },
    categoryText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      textTransform: 'capitalize',
    },
    categoryTextActive: {
      color: theme.colors.textInverse,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    modalActions: {
      marginTop: theme.spacing.xl,
    },
    modalButton: {
      width: '100%',
    },
  });

export default ProductListScreen;
