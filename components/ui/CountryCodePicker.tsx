import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemedText } from '../ThemedText';

interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
    maxLength: number;
}

interface CountryCodePickerProps {
    selectedCountry: Country;
    onSelectCountry: (country: Country) => void;
    style?: any;
}

// Comprehensive list of countries with dial codes - India first as default
const COUNTRIES: Country[] = [
    { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', maxLength: 10 },
    { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', maxLength: 10 },
    { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', maxLength: 10 },
    { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', maxLength: 11 },
    { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', maxLength: 9 },
    { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', maxLength: 11 },
    { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', maxLength: 10 },
    { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹', maxLength: 10 },
    { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸', maxLength: 9 },
    { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱', maxLength: 9 },
    { name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪', maxLength: 9 },
    { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭', maxLength: 9 },
    { name: 'Austria', code: 'AT', dialCode: '+43', flag: '🇦🇹', maxLength: 10 },
    { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪', maxLength: 9 },
    { name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴', maxLength: 8 },
    { name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰', maxLength: 8 },
    { name: 'Finland', code: 'FI', dialCode: '+358', flag: '🇫🇮', maxLength: 9 },
    { name: 'Poland', code: 'PL', dialCode: '+48', flag: '🇵🇱', maxLength: 9 },
    { name: 'Czech Republic', code: 'CZ', dialCode: '+420', flag: '🇨🇿', maxLength: 9 },
    { name: 'Hungary', code: 'HU', dialCode: '+36', flag: '🇭🇺', maxLength: 9 },
    { name: 'Romania', code: 'RO', dialCode: '+40', flag: '🇷🇴', maxLength: 10 },
    { name: 'Bulgaria', code: 'BG', dialCode: '+359', flag: '🇧🇬', maxLength: 9 },
    { name: 'Greece', code: 'GR', dialCode: '+30', flag: '🇬🇷', maxLength: 10 },
    { name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹', maxLength: 9 },
    { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪', maxLength: 9 },
    { name: 'Luxembourg', code: 'LU', dialCode: '+352', flag: '🇱🇺', maxLength: 9 },
    { name: 'Iceland', code: 'IS', dialCode: '+354', flag: '🇮🇸', maxLength: 7 },
    { name: 'Russia', code: 'RU', dialCode: '+7', flag: '🇷🇺', maxLength: 10 },
    { name: 'Ukraine', code: 'UA', dialCode: '+380', flag: '🇺🇦', maxLength: 9 },
    { name: 'Belarus', code: 'BY', dialCode: '+375', flag: '🇧🇾', maxLength: 9 },
    { name: 'Lithuania', code: 'LT', dialCode: '+370', flag: '🇱🇹', maxLength: 8 },
    { name: 'Latvia', code: 'LV', dialCode: '+371', flag: '🇱🇻', maxLength: 8 },
    { name: 'Estonia', code: 'EE', dialCode: '+372', flag: '🇪🇪', maxLength: 8 },
    { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳', maxLength: 11 },
    { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵', maxLength: 11 },
    { name: 'South Korea', code: 'KR', dialCode: '+82', flag: '🇰🇷', maxLength: 11 },
    { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰', maxLength: 10 },
    { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '🇧🇩', maxLength: 10 },
    { name: 'Sri Lanka', code: 'LK', dialCode: '+94', flag: '🇱🇰', maxLength: 9 },
    { name: 'Nepal', code: 'NP', dialCode: '+977', flag: '🇳🇵', maxLength: 10 },
    { name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭', maxLength: 9 },
    { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾', maxLength: 10 },
    { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬', maxLength: 8 },
    { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩', maxLength: 12 },
    { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭', maxLength: 10 },
    { name: 'Vietnam', code: 'VN', dialCode: '+84', flag: '🇻🇳', maxLength: 9 },
    { name: 'Cambodia', code: 'KH', dialCode: '+855', flag: '🇰🇭', maxLength: 9 },
    { name: 'Laos', code: 'LA', dialCode: '+856', flag: '🇱🇦', maxLength: 8 },
    { name: 'Myanmar', code: 'MM', dialCode: '+95', flag: '🇲🇲', maxLength: 9 },
    { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷', maxLength: 11 },
    { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷', maxLength: 10 },
    { name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱', maxLength: 9 },
    { name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴', maxLength: 10 },
    { name: 'Peru', code: 'PE', dialCode: '+51', flag: '🇵🇪', maxLength: 9 },
    { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽', maxLength: 10 },
    { name: 'Venezuela', code: 'VE', dialCode: '+58', flag: '🇻🇪', maxLength: 10 },
    { name: 'Ecuador', code: 'EC', dialCode: '+593', flag: '🇪🇨', maxLength: 9 },
    { name: 'Uruguay', code: 'UY', dialCode: '+598', flag: '🇺🇾', maxLength: 8 },
    { name: 'Paraguay', code: 'PY', dialCode: '+595', flag: '🇵🇾', maxLength: 9 },
    { name: 'Bolivia', code: 'BO', dialCode: '+591', flag: '🇧🇴', maxLength: 8 },
    { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦', maxLength: 9 },
    { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬', maxLength: 10 },
    { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪', maxLength: 9 },
    { name: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭', maxLength: 9 },
    { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬', maxLength: 10 },
    { name: 'Morocco', code: 'MA', dialCode: '+212', flag: '🇲🇦', maxLength: 9 },
    { name: 'Tunisia', code: 'TN', dialCode: '+216', flag: '🇹🇳', maxLength: 8 },
    { name: 'Algeria', code: 'DZ', dialCode: '+213', flag: '🇩🇿', maxLength: 9 },
    { name: 'Libya', code: 'LY', dialCode: '+218', flag: '🇱🇾', maxLength: 9 },
    { name: 'Israel', code: 'IL', dialCode: '+972', flag: '🇮🇱', maxLength: 9 },
    { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷', maxLength: 10 },
    { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', maxLength: 9 },
    { name: 'UAE', code: 'AE', dialCode: '+971', flag: '🇦🇪', maxLength: 9 },
    { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦', maxLength: 8 },
    { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: '🇰🇼', maxLength: 8 },
    { name: 'Bahrain', code: 'BH', dialCode: '+973', flag: '🇧🇭', maxLength: 8 },
    { name: 'Oman', code: 'OM', dialCode: '+968', flag: '🇴🇲', maxLength: 8 },
    { name: 'Jordan', code: 'JO', dialCode: '+962', flag: '🇯🇴', maxLength: 9 },
    { name: 'Lebanon', code: 'LB', dialCode: '+961', flag: '🇱🇧', maxLength: 8 },
    { name: 'Syria', code: 'SY', dialCode: '+963', flag: '🇸🇾', maxLength: 9 },
    { name: 'Iraq', code: 'IQ', dialCode: '+964', flag: '🇮🇶', maxLength: 10 },
    { name: 'Iran', code: 'IR', dialCode: '+98', flag: '🇮🇷', maxLength: 10 },
    { name: 'Afghanistan', code: 'AF', dialCode: '+93', flag: '🇦🇫', maxLength: 9 },
];

const colors = {
    primary: {
        50: '#FFF0F3',
        500: '#FF4D6D',
        600: '#E03A58',
        700: '#C12A49',
    },
    neutral: {
        surface0: '#FFFFFF',
        ink900: '#111114',
        ink600: '#6B7280',
        ink300: '#D1D5DB',
        ink100: '#F3F4F6',
    },
};

export const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
    selectedCountry,
    onSelectCountry,
    style,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCountries = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dialCode.includes(searchQuery)
    );

    const renderCountryItem = ({ item }: { item: Country }) => (
        <TouchableOpacity
            style={styles.countryItem}
            onPress={() => {
                onSelectCountry(item);
                setIsVisible(false);
                setSearchQuery('');
            }}
        >
            <View style={styles.countryInfo}>
                <Text style={styles.countryName}>{item.name}</Text>
                <Text style={styles.dialCode}>{item.dialCode}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <TouchableOpacity
                style={[styles.trigger, style]}
                onPress={() => setIsVisible(true)}
            >
                <Text style={styles.triggerCode}>{selectedCountry.dialCode}</Text>
                <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>

            <Modal
                visible={isVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsVisible(false)}
                        >
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                        <ThemedText type="h3" style={styles.modalTitle}>
                            Select Country
                        </ThemedText>
                        <View style={styles.placeholder} />
                    </View>

                    <View style={styles.searchContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search countries..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                    </View>

                    <FlatList
                        data={filteredCountries}
                        renderItem={renderCountryItem}
                        keyExtractor={(item) => item.code}
                        style={styles.countryList}
                        showsVerticalScrollIndicator={false}
                    />
                </SafeAreaView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutral.ink100,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRightWidth: 1,
        borderRightColor: colors.neutral.ink300,
        minWidth: 80,
    },
    triggerCode: {
        fontSize: 16,
        color: colors.neutral.ink900,
        fontWeight: '500',
        flex: 1,
    },
    chevron: {
        fontSize: 12,
        color: colors.neutral.ink600,
        marginLeft: 4,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: colors.neutral.surface0,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.ink100,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.neutral.ink100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: {
        fontSize: 16,
        color: colors.neutral.ink600,
        fontWeight: '500',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.neutral.ink900,
    },
    placeholder: {
        width: 32,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
        backgroundColor: colors.neutral.ink100,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.neutral.ink900,
    },
    countryList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.ink100,
    },
    countryInfo: {
        flex: 1,
    },
    countryName: {
        fontSize: 16,
        color: colors.neutral.ink900,
        fontWeight: '500',
        marginBottom: 2,
    },
    dialCode: {
        fontSize: 14,
        color: colors.neutral.ink600,
    },
});

// Export default country (US)
export const DEFAULT_COUNTRY: Country = COUNTRIES[0];

export default CountryCodePicker;
