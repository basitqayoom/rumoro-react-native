import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    value: 'for-you' | 'following';
    onChange: (v: 'for-you' | 'following') => void;
    theme: {
        primary: Record<number, string>;
        text: string;
        border: string;
        background: string;
        tabIconDefault: string;
    };
};

export default function SegmentedTwoTab({ value, onChange, theme }: Props) {
    const [w, setW] = useState(0);
    const halfW = w / 2;

    const x = useRef(new Animated.Value(value === 'for-you' ? 0 : 1)).current;

    useEffect(() => {
        Animated.timing(x, {
            toValue: value === 'for-you' ? 0 : 1,
            duration: 220,
            useNativeDriver: false,
        }).start();
    }, [value, x]);

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
        setW(e.nativeEvent.layout.width);
    }, []);

    const indicatorLeft = x.interpolate({
        inputRange: [0, 1],
        outputRange: [0, halfW],
    });

    return (
        <View
            onLayout={handleLayout}
            style={{
                width: '100%',
                backgroundColor: theme.background,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: theme.border,
            }}
        >
            <View style={{ height: 44, flexDirection: 'row' }}>
                {/* Animated indicator */}
                <Animated.View
                    pointerEvents="none"
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: indicatorLeft,
                        width: halfW,
                        height: 2,
                        backgroundColor: theme.primary[500],
                    }}
                />

                {/* Left tab */}
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => onChange('for-you')}
                    activeOpacity={0.8}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: value === 'for-you' ? '800' : '600',
                            color: value === 'for-you' ? theme.primary[600] : theme.tabIconDefault,
                        }}
                    >
                        For You
                    </Text>
                </TouchableOpacity>

                {/* Right tab */}
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => onChange('following')}
                    activeOpacity={0.8}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: value === 'following' ? '800' : '600',
                            color: value === 'following' ? theme.primary[600] : theme.tabIconDefault,
                        }}
                    >
                        Following
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
