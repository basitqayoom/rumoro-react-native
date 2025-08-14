import React from 'react';
import { Image, ImageStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

export interface ProfileAvatarProps {
    size?: 'small' | 'medium' | 'large';
    style?: ViewStyle;
    imageStyle?: ImageStyle;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    size = 'medium',
    style,
    imageStyle,
}) => {
    const sizeConfig = {
        small: { containerSize: 24, borderRadius: 12 },
        medium: { containerSize: 32, borderRadius: 16 },
        large: { containerSize: 40, borderRadius: 20 },
    };

    const config = sizeConfig[size];

    return (
        <View
            style={[
                {
                    width: config.containerSize,
                    height: config.containerSize,
                    borderRadius: config.borderRadius,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: Colors.light.border,
                },
                style,
            ]}
        >
            <Image
                source={{ uri: 'https://avatar.iran.liara.run/public/4' }}
                style={[
                    {
                        width: config.containerSize,
                        height: config.containerSize,
                        borderRadius: config.borderRadius,
                    },
                    imageStyle,
                ]}
                resizeMode="cover"
            />
        </View>
    );
};

export default ProfileAvatar;
