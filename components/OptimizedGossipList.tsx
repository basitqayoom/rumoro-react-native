import React, { useCallback, memo } from 'react';
import { View, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { ThemedText } from './ThemedText';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

interface Gossip {
  id: string;
  profile: {
    id: string;
    handle: string;
    platform: string;
    displayName: string;
    avatar?: string;
  };
  channel: {
    id: string;
    name: string;
    type: string;
  };
  content: string;
  imageUrl?: string;
  replyCount: number;
  likeCount: number;
  createdAt: string;
  isBoosted: boolean;
  isLiked: boolean;
  authorName: string;
  trendingScore: number;
}

interface OptimizedGossipListProps {
  data: Gossip[];
  onEndReached?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isLoading?: boolean;
  renderItem: ({ item }: { item: Gossip }) => React.ReactElement;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement;
  estimatedItemSize?: number;
}

const LoadingFooter = memo(() => (
  <View style={styles.footerContainer}>
    <ActivityIndicator size="small" color="#FF4D6D" />
  </View>
));

const ItemSeparator = memo(() => (
  <View style={styles.separator} />
));

export const OptimizedGossipList: React.FC<OptimizedGossipListProps> = memo(({
  data,
  onEndReached,
  onRefresh,
  isRefreshing = false,
  isLoading = false,
  renderItem,
  ListEmptyComponent,
  ListHeaderComponent,
  estimatedItemSize = 200,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const keyExtractor = useCallback((item: Gossip) => item.id, []);

  const handleEndReached = useCallback(() => {
    if (!isLoading && onEndReached) {
      onEndReached();
    }
  }, [isLoading, onEndReached]);

  const EmptyComponent = useCallback(() => {
    if (ListEmptyComponent) {
      return typeof ListEmptyComponent === 'function' 
        ? <ListEmptyComponent /> 
        : ListEmptyComponent;
    }
    
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.emptyText}>No gossips yet. Be the first to spill the tea!</ThemedText>
      </View>
    );
  }, [ListEmptyComponent, colors]);

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={estimatedItemSize}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ItemSeparatorComponent={ItemSeparator}
      ListFooterComponent={isLoading ? LoadingFooter : null}
      ListEmptyComponent={EmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#FF4D6D"
            colors={['#FF4D6D']}
          />
        ) : undefined
      }
      removeClippedSubviews={true}
      drawDistance={200}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    />
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
  },
  footerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  separator: {
    height: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});