import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions, PanResponder, PanResponderInstance, FlatList, TouchableOpacity } from 'react-native';

interface CarouselProps {
  items: React.ReactNode[];
  disableGestures?: boolean;
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({ items, disableGestures, currentPage, onPageChange }) => {
  const carouselRef = useRef<FlatList>(null);
  const panResponder = useRef<PanResponderInstance | null>(null);

  useEffect(() => {
    if (disableGestures) {
      panResponder.current = null;
    } else {
      panResponder.current = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_event, gestureState) => {
          // Disable horizontal swipe gestures
          if (Math.abs(gestureState.dx) > 20) {
            return false;
          }
        },
      });
    }
  }, [disableGestures]);

  const handlePageChange = (pageIndex: number) => {
    onPageChange(pageIndex);
    carouselRef.current?.scrollToIndex({ index: pageIndex });
  };

  const handleScrollEnd = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const pageIndex = Math.round(contentOffset.x / Dimensions.get('window').width);
    onPageChange(pageIndex);
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage < items.length) {
      handlePageChange(nextPage);
    }
  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 0) {
      handlePageChange(prevPage);
    }
  };

  const renderItem = ({ item }: { item: React.ReactNode }) => {
    return (
      <View style={styles.page}>
        {/* Render the carousel item */}
        {item}
      </View>
    );
  };

  return (
    <View style={styles.container} {...(panResponder.current?.panHandlers || {})}>
      <FlatList
        ref={carouselRef}
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEnabled={!disableGestures}
        initialScrollIndex={currentPage}
      />

      {/* Initial page render */}
      {items[currentPage]}

      {/* Render navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={handlePrevPage}
          disabled={currentPage === 0 || disableGestures}
        />

        <TouchableOpacity
          style={styles.navigationButton}
          onPress={handleNextPage}
          disabled={currentPage === items.length - 1 || disableGestures}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    width: Dimensions.get('window').width,
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  navigationButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default Carousel;
