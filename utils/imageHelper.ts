import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import apiClient from '../store/api/apiClient';

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
}

export const requestPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to upload images!');
    return false;
  }
  return true;
};

export const pickImage = async (options?: ImagePicker.ImagePickerOptions): Promise<string | null> => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    ...options,
  });

  if (!result.canceled && result.assets[0]) {
    return await compressImage(result.assets[0].uri);
  }
  return null;
};

export const takePhoto = async (options?: ImagePicker.ImagePickerOptions): Promise<string | null> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera permissions to take photos!');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    ...options,
  });

  if (!result.canceled && result.assets[0]) {
    return await compressImage(result.assets[0].uri);
  }
  return null;
};

export const compressImage = async (uri: string, maxWidth: number = 800): Promise<string> => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    return uri;
  }
};

export const uploadImage = async (
  uri: string,
  type: 'profile' | 'gossip' | 'message'
): Promise<string> => {
  const formData = new FormData();
  
  const filename = `${type}_${Date.now()}.jpg`;
  const file = {
    uri,
    type: 'image/jpeg',
    name: filename,
  } as any;
  
  formData.append('image', file);
  formData.append('type', type);

  try {
    const response = await apiClient.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });
    
    return response.data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

export const getImageDimensions = (uri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });
};