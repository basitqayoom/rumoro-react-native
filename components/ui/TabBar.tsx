/* eslint-disable import/namespace */
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Icon } from './Icon';

const TABS = [
  { key: 'feed', icon: 'home', label: 'Feed' },
  { key: 'search', icon: 'search', label: 'Search' },
  { key: 'channels', icon: 'globe', label: 'Channels' },
  { key: 'notifications', icon: 'bell', label: 'Notifications' },
  { key: 'messages', icon: 'message', label: 'Messages' },
];

export default function TabBar() {
  // TODO: Add navigation logic and active tab state
  return (
    <View style={styles.tabBar}>
      {TABS.map(tab => (
        <TouchableOpacity key={tab.key} style={styles.tabButton} accessibilityLabel={tab.label}>
          <Icon name={tab.icon} size={28} color={Colors.dark.primary[500]} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 56,
    backgroundColor: Colors.light.neutral.surface0,
    borderTopWidth: 1,
    borderTopColor: Colors.light.neutral.ink100,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});
