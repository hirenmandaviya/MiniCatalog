import AsyncStorage from '@react-native-async-storage/async-storage';

const FAV_KEY = 'favourites';

export const saveFavourite = async (user: any) => {
  const favs: any[] = JSON.parse((await AsyncStorage.getItem(FAV_KEY)) || '[]');
  if (!favs.find(u => u.id === user.id)) {
    favs.push(user);
    await AsyncStorage.setItem(FAV_KEY, JSON.stringify(favs));
  }
};

export const getFavourites = async (): Promise<any[]> => {
  return JSON.parse((await AsyncStorage.getItem(FAV_KEY)) || '[]');
};

export const removeFavourite = async (userId: number) => {
  const favs: any[] = JSON.parse((await AsyncStorage.getItem(FAV_KEY)) || '[]');
  await AsyncStorage.setItem(FAV_KEY, JSON.stringify(favs.filter(u => u.id !== userId)));
};
