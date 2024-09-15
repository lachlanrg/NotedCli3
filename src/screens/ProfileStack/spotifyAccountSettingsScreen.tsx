import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dark, gray, lgray, light } from '../../components/colorModes';
import { useSpotify } from '../../context/SpotifyContext';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import { updateUser } from '../../graphql/mutations';

const SpotifyAccountSettingsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpotifyData = async () => {
            const accessToken = await AsyncStorage.getItem('spotifyAccessToken');
            const user = await AsyncStorage.getItem('spotifyUser');

            if (user) {
                const userObj = JSON.parse(user);
                setUserId(userObj.id);
                setDisplayName(userObj.display_name);
                setEmail(userObj.email);
                setProfileImage(userObj.images?.[0]?.url || null);
            }

            setAccessToken(accessToken);
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
            navigation.goBack();
        } catch (error) {
            console.log('Error signing out Spotify user: ', error);
        }
    };

    const [RPDStatus, setRPDstatus] = useState(false);

    const fetchRPDStatus = async () => {
        const client = generateClient();
        try {
            const { userId } = await getCurrentUser();
            const response = await client.graphql({
                query: queries.getUser,
                variables: {
                    id: userId,
                },
            });
            const fetchedRPD = response.data?.getUser?.recentlyPlayedDisabled;
            const booleanRPD = fetchedRPD === true;
            setRPDstatus(booleanRPD);
        } catch (error) {
            console.error('Error fetching public profile status:', error);
        }
    };

    useEffect(() => {
        fetchRPDStatus();
    }, []);


    const toggleDisableRecentlyPlayed = async () => {
        const client = generateClient();
        try {
            const { userId } = await getCurrentUser();
            const newRPDStatus = !RPDStatus;
            
            console.log('Attempting to update RPD to:', newRPDStatus);

            const getUserResponse = await client.graphql({
                query: queries.getUser,
                variables: { id: userId },
            });

            const currentUser = getUserResponse.data.getUser;
            if (!currentUser) {
                throw new Error('User data not found');
            }

            const response = await client.graphql({
                query: updateUser,
                variables: {
                    input: {
                        id: userId,
                        recentlyPlayedDisabled: newRPDStatus,
                        _version: currentUser._version,
                    },
                },
            });
            
            const updateRPD = response.data.updateUser.recentlyPlayedDisabled;
            
            console.log('Server returned publicProfile:', updateRPD);

            setRPDstatus(updateRPD === true);
            console.log('Profile visibility updated to:', updateRPD);
        } catch (error) {
            console.error('Error updating profile visibility:', error);
            // Revert the UI state if the update failed
            setRPDstatus(!RPDStatus);
        }
    };

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Spotify Account</Text>
                </View>

                {!accessToken ? (
                    <View style={styles.content}>
                        <Text style={styles.noAccountText}>No Spotify account connected</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SignUpSpotifyLogin')}
                            style={styles.loginButton}
                        >
                            <Text style={styles.loginButtonText}>Connect Spotify</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.content}>
                        {profileImage && (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        )}
                        <Text style={styles.displayName}>{displayName}</Text>
                        <Text style={styles.infoText}>{userId}</Text>
                        <Text style={styles.infoText}>{email}</Text>
                        <View style={styles.settingItem}>
                            <View>
                                <Text style={styles.settingLabel}>Disable Recently Played</Text>
                                <Text style={{color: lgray, fontSize: 12, fontStyle: 'italic'}}>
                                    {RPDStatus ? 'Not displaying' : 'Currently displaying by default'}
                                </Text>
                            </View>
                            <Switch
                                value={RPDStatus}
                                onValueChange={toggleDisableRecentlyPlayed}
                                trackColor={{ false: gray, true: lgray }}
                                thumbColor={RPDStatus ? light : dark}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleSpotifySignOut}
                            style={styles.logoutButton}
                        >
                            <Text style={styles.logoutButtonText}>Disconnect Spotify</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: gray,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: light,
        textAlign: 'center',
        marginRight: 30,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    displayName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: light,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        color: light,
        marginBottom: 5,
        textAlign: 'center',
    },
    noAccountText: {
        fontSize: 18,
        color: light,
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: '#1DB954',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#FF4136',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 40,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: gray,
        width: '100%',
        paddingTop: 30,
    },
    settingLabel: {
        fontSize: 16,
        color: light,
    },
});

export default SpotifyAccountSettingsScreen;