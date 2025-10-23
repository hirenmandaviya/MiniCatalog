import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useAppSelector } from '../store';
import { getTheme } from '../theme';
import { selectIsDark } from '../store/themeSlice';
import ImageWithFadeIn from './ImageWithFadeIn';
import { scale, verticalScale } from '../utils/scale';

const { width } = Dimensions.get('window');

interface ImageCarouselProps {
  images: string[];
  height?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, height = verticalScale(300) }) => {
  const isDark = useAppSelector(selectIsDark);
  const theme = getTheme(isDark);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveIndex(currentIndex);
  };

  const styles = createStyles(theme, height);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((imageUri, index) => (
          <ImageWithFadeIn key={index} uri={imageUri} style={styles.image} resizeMode="cover" />
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.paginationDot, index === activeIndex && styles.paginationDotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: any, height: number) =>
  StyleSheet.create({
    container: {
      width,
      height,
      backgroundColor: theme.colors.backgroundTertiary,
    },
    image: {
      width,
      height,
    },
    pagination: {
      position: 'absolute',
      bottom: theme.spacing.base,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paginationDot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      marginHorizontal: scale(4),
    },
    paginationDotActive: {
      width: scale(24),
      backgroundColor: theme.colors.primary,
    },
  });

export default ImageCarousel;
