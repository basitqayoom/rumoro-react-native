import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, ViewStyle } from 'react-native';

const blurhash = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';

interface LazyImageProps {
  source: { uri: string } | number;
  style?: ViewStyle | ViewStyle[];
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholder?: string;
  transition?: number;
  cachePolicy?: 'none' | 'disk' | 'memory' | 'memory-disk';
  priority?: 'low' | 'normal' | 'high';
  onLoad?: () => void;
  onError?: (error: any) => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  source,
  style,
  contentFit = 'cover',
  placeholder = blurhash,
  transition = 200,
  cachePolicy = 'memory-disk',
  priority = 'normal',
  onLoad,
  onError,
}) => {
  return (
    <Image
      source={source}
      style={style}
      placeholder={placeholder}
      contentFit={contentFit}
      transition={transition}
      cachePolicy={cachePolicy}
      priority={priority}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default LazyImage;