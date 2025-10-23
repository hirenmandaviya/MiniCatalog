import { LinkingOptions } from '@react-navigation/native';
import { SCREENS } from '../utils/screen';

const linking: LinkingOptions<any> = {
  prefixes: ['minicatalog://', 'https://minicatalog.app'],
  config: {
    screens: {
      [SCREENS.MAIN]: {
        screens: {
          [SCREENS.PRODUCTS]: 'products',
          [SCREENS.FAVORITES]: 'favorites',
          [SCREENS.CART]: 'cart',
          [SCREENS.SETTINGS]: 'settings',
        },
      },
      [SCREENS.PRODUCT_DETAILS]: {
        path: 'product/:productId',
        parse: {
          productId: (productId: string) => productId,
        },
      },
    },
  },
};

export default linking;

