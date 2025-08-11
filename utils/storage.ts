import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  FIRST_LAUNCH: '@first_launch',
  USER_TYPE: '@user_type',
  USER_DATA: '@user_data',
};

export const StorageService = {
  // First launch check
  async isFirstLaunch(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
    return value === null;
  },

  async setFirstLaunchComplete(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
  },

  // User data storage
  async saveUserData(userType: 'student' | 'teacher', userData: any): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  },

  async getUserType(): Promise<'student' | 'teacher' | null> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_TYPE);
    return value as 'student' | 'teacher' | null;
  },

  async getUserData(): Promise<any | null> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return value ? JSON.parse(value) : null;
  },

  async clearUserData(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_TYPE);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};
