import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dark, gray, light } from '../../components/colorModes';
import { convertMillisecondsToMinutes } from '../../utils/timeUtils';

const SpotifyAccountSettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [expirationDate, setExpirationDate] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpotifyData = async () => {
            const accessToken = await AsyncStorage.getItem('spotifyAccessToken');
            const refreshToken = await AsyncStorage.getItem('spotifyRefreshToken');
            const expirationDate = await AsyncStorage.getItem('spotifyTokenExpiration');
            const user = await AsyncStorage.getItem('spotifyUser');

            if (user) {
                const userObj = JSON.parse(user);
                setUserId(userObj.id);
                setDisplayName(userObj.display_name);
                setEmail(userObj.email);
            }

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setExpirationDate(expirationDate);
        };

        fetchSpotifyData();
    }, []);

    const handleSpotifySignOut = async () => {
        try {
            await AsyncStorage.removeItem('spotifyAccessToken');
            await AsyncStorage.removeItem('spotifyRefreshToken');
            await AsyncStorage.removeItem('spotifyTokenExpiration');
            await AsyncStorage.removeItem('spotifyUser');
            console.log('Spotify user signed out');
            Alert.alert("Success", "Signed out of Spotify Account.");
        } catch (error) {
            console.log('Error signing out Spotify user: ', error);
        }
    };

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Spotify Account Settings</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.label}><Text style={styles.boldText}>User ID:</Text> {userId}</Text>
                    <Text style={styles.label}><Text style={styles.boldText}>Display Name:</Text> {displayName}</Text>
                    <Text style={styles.label}><Text style={styles.boldText}>Email:</Text> {email}</Text>
                    <Text style={styles.label}><Text style={styles.boldText}>Access Token:</Text> {accessToken}</Text>
                    <Text style={styles.label}><Text style={styles.boldText}>Refresh Token:</Text> {refreshToken}</Text>
                     {/* {expirationDate && (
                        <Text>Token expires in: {convertMillisecondsToMinutes(parseInt(expirationDate))} minutes</Text>
                    )} */}
                    <Text style={styles.label}><Text style={styles.boldText}>Token expires in:</Text> {expirationDate ? Math.floor(parseInt(expirationDate) / 60000) : 'N/A'} minutes</Text>
                </View>
                </View>
                <View style={styles.logoutContainer}>
                    <TouchableOpacity onPress={handleSpotifySignOut} style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: dark,
    },
    container: {
        flex: 1,
        backgroundColor: dark,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: dark,
        borderBottomWidth: 2,
        borderBottomColor: gray,
        paddingBottom: 10,
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: light,
        textAlign: 'center',
        marginRight: 34, // To center the title with the back button
    },
    content: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingTop: 30,
        padding: 10,
    },
    label: {
        color: light,
        marginBottom: 30,
    },
    boldText: {
        fontWeight: 'bold',
    },
    logoutContainer: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    logoutButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 8,
        margin: 20,
        alignItems: 'center',
        width: 200,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SpotifyAccountSettingsScreen;