import {
    AntDesign,
    Feather,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons
} from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';

type IconLibrary = 'ionicons' | 'material' | 'antdesign' | 'feather' | 'fontawesome' | 'materialcommunity';

interface IconProps {
    name: string;
    library?: IconLibrary;
    size?: number;
    color?: string;
    style?: any;
}

// Icon mapping with library and proper icon names
const ICON_MAP = {
    // Navigation
    'arrow-left': { library: 'ionicons', name: 'arrow-back' },
    'arrow-right': { library: 'ionicons', name: 'arrow-forward' },
    'chevron-down': { library: 'ionicons', name: 'chevron-down' },
    'chevron-up': { library: 'ionicons', name: 'chevron-up' },
    'chevron-left': { library: 'ionicons', name: 'chevron-back' },
    'chevron-right': { library: 'ionicons', name: 'chevron-forward' },

    // Communication
    'phone': { library: 'ionicons', name: 'call' },
    'message': { library: 'ionicons', name: 'chatbubble' },
    'message-circle': { library: 'ionicons', name: 'chatbubble-outline' },
    'mail': { library: 'ionicons', name: 'mail' },
    'send': { library: 'ionicons', name: 'send' },

    // Social
    'google': { library: 'antdesign', name: 'google' },
    'instagram': { library: 'antdesign', name: 'instagram' },
    'twitter': { library: 'antdesign', name: 'twitter' },
    'snapchat': { library: 'fontawesome', name: 'snapchat' },

    // Actions
    'check': { library: 'ionicons', name: 'checkmark' },
    'close': { library: 'ionicons', name: 'close' },
    'add': { library: 'ionicons', name: 'add' },
    'remove': { library: 'ionicons', name: 'remove' },
    'search': { library: 'ionicons', name: 'search' },
    'refresh': { library: 'ionicons', name: 'refresh' },

    // Security
    'lock': { library: 'ionicons', name: 'lock-closed' },
    'unlock': { library: 'ionicons', name: 'lock-open' },
    'shield': { library: 'ionicons', name: 'shield-checkmark' },
    'key': { library: 'ionicons', name: 'key' },

    // Status
    'success': { library: 'ionicons', name: 'checkmark-circle' },
    'error': { library: 'ionicons', name: 'close-circle' },
    'warning': { library: 'ionicons', name: 'warning' },
    'info': { library: 'ionicons', name: 'information-circle' },

    // UI Elements
    'star': { library: 'ionicons', name: 'star' },
    'heart': { library: 'ionicons', name: 'heart' },
    'thumbs-up': { library: 'ionicons', name: 'thumbs-up' },
    'fire': { library: 'ionicons', name: 'flame' },
    'eye': { library: 'ionicons', name: 'eye' },
    'eye-off': { library: 'ionicons', name: 'eye-off' },

    // Time
    'clock': { library: 'ionicons', name: 'time' },
    'calendar': { library: 'ionicons', name: 'calendar' },
    'timer': { library: 'ionicons', name: 'timer' },

    // Misc
    'globe': { library: 'ionicons', name: 'globe' },
    'home': { library: 'ionicons', name: 'home' },
    'user': { library: 'ionicons', name: 'person' },
    'users': { library: 'ionicons', name: 'people' },
    'settings': { library: 'ionicons', name: 'settings' },
    'menu': { library: 'ionicons', name: 'menu' },
    'dots': { library: 'ionicons', name: 'ellipsis-horizontal' },
    'flag': { library: 'ionicons', name: 'flag' },
    'lightbulb': { library: 'ionicons', name: 'bulb' },

    // Drawer icons
    'person': { library: 'ionicons', name: 'person' },
    'link': { library: 'ionicons', name: 'link' },
    'add-circle': { library: 'ionicons', name: 'add-circle' },
    'bookmark': { library: 'ionicons', name: 'bookmark' },
    'information-circle': { library: 'ionicons', name: 'information-circle' },
    'log-out': { library: 'ionicons', name: 'log-out' },
    'chevron-forward': { library: 'ionicons', name: 'chevron-forward' },
};

const getIconComponent = (library: IconLibrary) => {
    switch (library) {
        case 'ionicons':
            return Ionicons;
        case 'material':
            return MaterialIcons;
        case 'antdesign':
            return AntDesign;
        case 'feather':
            return Feather;
        case 'fontawesome':
            return FontAwesome;
        case 'materialcommunity':
            return MaterialCommunityIcons;
        default:
            return Ionicons;
    }
};

export const Icon: React.FC<IconProps> = ({
    name,
    library,
    size = 16,
    color = '#111114',
    style,
}) => {
    const iconConfig = ICON_MAP[name as keyof typeof ICON_MAP];

    if (!iconConfig && !library) {
        // Fallback to Ionicons with the name as-is
        const IconComponent = Ionicons;
        return (
            <IconComponent
                name={name as any}
                size={size}
                color={color}
                style={[styles.icon, style]}
            />
        );
    }

    const iconLibrary = (library || iconConfig?.library || 'ionicons') as IconLibrary;
    const iconName = iconConfig?.name || name;
    const IconComponent = getIconComponent(iconLibrary);

    return (
        <IconComponent
            name={iconName as any}
            size={size}
            color={color}
            style={[styles.icon, style]}
        />
    );
};

const styles = StyleSheet.create({
    icon: {
        textAlign: 'center',
    },
});

export default Icon;
