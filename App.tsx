import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { StatusBar, LogBox } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import './src/i18n';
import { useAppDispatch, useAppSelector } from './src/store';
import { getTheme } from './src/theme';
import { selectIsDark } from './src/store/themeSlice';
import { fetchProducts, loadCachedProducts } from './src/features/products/productsSlice';
import { loadCart } from './src/features/cart/cartSlice';
import { loadFavorites } from './src/features/favorites/favoritesSlice';
import SplashScreen from './src/components/SplashScreen';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);
  const [showSplash, setShowSplash] = useState(true);

  LogBox.ignoreAllLogs();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load cached data first
        await Promise.all([dispatch(loadCart()), dispatch(loadFavorites())]);

        // Check network connectivity
        const netInfo = await NetInfo.fetch();

        if (!netInfo.isConnected) {
          // Fetch fresh data only if online
          dispatch(fetchProducts());
        } else {
          await dispatch(loadCachedProducts());
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeApp();

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        dispatch(fetchProducts());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <NavigationContainer linking={require('./src/navigation/linking').default}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
          <AppContent />
        </SafeAreaView>
      </SafeAreaProvider>
    </ReduxProvider>
  );
};

export default App;
