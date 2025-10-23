import { SCREENS } from '../utils/screen';

export type RootStackParamList = {
  [SCREENS.MAIN]: {
    screen?: typeof SCREENS.PRODUCTS | typeof SCREENS.FAVORITES | typeof SCREENS.CART | typeof SCREENS.SETTINGS;
  };
  [SCREENS.PRODUCT_DETAILS]: {
    productId: string;
  };
};

export type MainTabParamList = {
  [SCREENS.PRODUCTS]: undefined;
  [SCREENS.FAVORITES]: undefined;
  [SCREENS.CART]: undefined;
  [SCREENS.SETTINGS]: undefined;
};

