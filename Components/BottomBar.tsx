import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { requireAccount } from '../Utils/requireAccount';
import { colors, spacing } from './ui/theme';

interface BottomBarProps {
  navigation: NavigationProp<any>;
}

type IconName = keyof typeof Ionicons.glyphMap;

const tabs: { route: string, label: string, icon: IconName, activeIcon: IconName, needsAccount?: boolean }[] = [
  { route: 'Home', label: 'Início', icon: 'home-outline', activeIcon: 'home' },
  { route: 'Notifications', label: 'Notificações', icon: 'notifications-outline', activeIcon: 'notifications' },
  { route: 'Sell', label: 'Vender', icon: 'add-circle-outline', activeIcon: 'add-circle', needsAccount: true },
  { route: 'Messages', label: 'Mensagens', icon: 'mail-outline', activeIcon: 'mail', needsAccount: true },
  { route: 'Profile', label: 'Perfil', icon: 'person-outline', activeIcon: 'person' },
];

const BottomBar: React.FC<BottomBarProps> = ({ navigation }) => {
  const currentRoute = useRoute().name;
  const insets = useSafeAreaInsets();

  const openTab = (tab: typeof tabs[number]) => {
    if (tab.route === currentRoute) return;
    if (tab.needsAccount && !requireAccount()) return;
    // pop: go back to the tab's screen if it is already open instead of stacking another copy.
    navigation.navigate(tab.route, undefined, { pop: true });
  };

  return (
    <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const active = tab.route === currentRoute;
        const color = active ? colors.primary : colors.textSecondary;
        return (
          <Pressable
            key={tab.route}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            onPress={() => openTab(tab)}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
          >
            <Ionicons name={active ? tab.activeIcon : tab.icon} size={24} color={color} />
            <Text style={[styles.label, { color }, active && styles.activeLabel]} numberOfLines={1} maxFontSizeMultiplier={1.3}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
  },
  activeLabel: {
    fontWeight: 'bold',
  },
});

export default BottomBar;
