import React from 'react';
import { Image } from 'react-native';

type Props = {
    color: string;       // primary solid text color
    glow?: string;       // brighter tint for the sheen
    shadow?: string;     // soft shadow tint
};

export default function BrandTitle({ color, glow, shadow }: Props) {
    return (
        <Image
            source={require('../../../assets/images/logo/logo.png')}
            style={{
                width: 50,
                height: 50,
                borderRadius: 20,
            }}
            resizeMode="cover"
        />
    );
}
