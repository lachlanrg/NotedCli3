import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { getCurrentUser } from 'aws-amplify/auth';
import { light, mediumgray, dark, gray, lgray, error, spotifyGreen, soundcloudOrange } from '../colorModes';
import { generateClient } from 'aws-amplify/api';
import { getUser, listSpotifyTokens } from '../../graphql/queries';
import { updateUser } from '../../graphql/mutations';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import { faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const soundcloudIcon = faSoundcloud as IconProp;

export type Ref = BottomSheetModal;

interface SpotifyAccount {
    displayName: string;
    id: string;
    images: { url: string }[];
    externalUrls: { spotify: string };
}

const ProfileLinkBottomSheetModal = forwardRef<BottomSheetModal>((props, ref) => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [spotifyAccount, setSpotifyAccount] = useState<SpotifyAccount | null>(null);
    const [soundCloudUri, setSoundCloudUri] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [spotifyUri, setSpotifyUri] = useState<string | null>(null);
    const [showSoundCloudInput, setShowSoundCloudInput] = useState(false);
    const [soundCloudInput, setSoundCloudInput] = useState('');
    const [isValidSoundCloudLink, setIsValidSoundCloudLink] = useState(false);
    const snapPoints = useMemo(() => ['40%', '75%'], []);
    const [currentSnapPoint, setCurrentSnapPoint] = useState(0);
    const [spotifyImage, setSpotifyImage] = useState<string | null>(null);

    useEffect(() => {
        fetchUserData();

        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                (ref as React.RefObject<BottomSheetModal>).current?.snapToIndex(1);
                setCurrentSnapPoint(1);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                (ref as React.RefObject<BottomSheetModal>).current?.snapToIndex(0);
                setCurrentSnapPoint(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []); 
    
    async function fetchUserData() {
        try {
            const { userId, username } = await getCurrentUser();
            setUserInfo({ userId, username });

            const client = generateClient();
            const userData = await client.graphql({
                query: getUser,
                variables: { id: userId }
            });

            setSoundCloudUri(userData.data.getUser?.soundCloudUri || null);
            setSpotifyUri(userData.data.getUser?.spotifyUri || null);
            setSpotifyImage(userData.data.getUser?.spotifyImage || null);

            if (userData.data.getUser?.spotifyUri) {
                await fetchSpotifyAccount();
            }
        } catch (err) {
            console.log(err);
        }
    }

    const fetchSpotifyAccount = async () => {
        try {
            const client = generateClient();
            const { userId } = await getCurrentUser();

            // Fetch Spotify tokens
            const tokensData = await client.graphql({
                query: listSpotifyTokens,
                variables: { filter: { userId: { eq: userId } } }
            });

            const spotifyToken = tokensData.data.listSpotifyTokens.items[0];

            if (!spotifyToken) {
                console.log('No Spotify token found');
                return;
            }

            // Fetch Spotify user profile
            const response = await fetch(`https://api.spotify.com/v1/me`, {
                headers: {
                    'Authorization': `Bearer ${spotifyToken.spotifyAccessToken}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Spotify API error:', response.status, errorText);
                throw new Error(`Failed to fetch Spotify user profile: ${response.status} ${errorText}`);
            }

            const spotifyUserData = await response.json();

            // Update spotifyAccount state
            setSpotifyAccount({
                displayName: spotifyUserData.display_name,
                id: spotifyUserData.id,
                images: spotifyUserData.images,
                externalUrls: spotifyUserData.external_urls
            });

        } catch (error) {
            console.error('Error fetching Spotify account:', error);
        }
    };

    const renderBackDrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const { dismiss } = useBottomSheetModal();

    const handleFetchSpotifyAccount = async () => {
        try {
            const client = generateClient();
            const { userId } = await getCurrentUser();

            // Fetch Spotify tokens
            const tokensData = await client.graphql({
                query: listSpotifyTokens,
                variables: { filter: { userId: { eq: userId } } }
            });

            const spotifyToken = tokensData.data.listSpotifyTokens.items[0];

            if (!spotifyToken) {
                console.log('No Spotify token found');
                return;
            }

            // Fetch Spotify user profile
            const response = await fetch(`https://api.spotify.com/v1/me`, {
                headers: {
                    'Authorization': `Bearer ${spotifyToken.spotifyAccessToken}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Spotify API error:', response.status, errorText);
                throw new Error(`Failed to fetch Spotify user profile: ${response.status} ${errorText}`);
            }

            const spotifyUserData = await response.json();
            setSpotifyAccount({
                displayName: spotifyUserData.display_name,
                id: spotifyUserData.id,
                images: spotifyUserData.images,
                externalUrls: spotifyUserData.external_urls
            });

        } catch (error) {
            console.error('Error fetching Spotify account:', error);
        }
    };

    const extractSpotifyUserId = (uri: string) => {
        return uri.split('/').pop() || 'Unknown';
    };

    const handleAddSpotifyUri = async () => {
        if (!spotifyAccount || !userInfo) return;

        setIsAdding(true);
        try {
            const client = generateClient();
            const { userId } = userInfo;

            const userData = await client.graphql({
                query: getUser,
                variables: { id: userId }
            });

            const currentUser = userData.data.getUser;

            if (!currentUser) {
                console.error('User data not found');
                return;
            }

            const spotifyUri = spotifyAccount.externalUrls.spotify;
            const spotifyUserId = extractSpotifyUserId(spotifyUri);

            await client.graphql({
                query: updateUser,
                variables: {
                    input: {
                        id: userId,
                        spotifyUri: spotifyUri,
                        spotifyImage: spotifyAccount.images[0]?.url || null,
                        _version: currentUser._version
                    }
                }
            });

            console.log('Spotify URI and image added successfully');
            setSpotifyUri(spotifyUri);
            setSpotifyImage(spotifyAccount.images[0]?.url || null);
            setSpotifyAccount({
                ...spotifyAccount,
                id: spotifyUserId
            });
        } catch (error) {
            console.error('Error adding Spotify URI and image:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemoveSpotifyUri = async () => {
        if (!userInfo) return;

        setIsRemoving(true);
        try {
            const client = generateClient();
            const { userId } = userInfo;

            const userData = await client.graphql({
                query: getUser,
                variables: { id: userId }
            });

            const currentUser = userData.data.getUser;

            if (!currentUser) {
                console.error('User data not found');
                return;
            }

            await client.graphql({
                query: updateUser,
                variables: {
                    input: {
                        id: userId,
                        spotifyUri: null,
                        _version: currentUser._version
                    }
                }
            });

            console.log('Spotify URI removed successfully');
            setSpotifyUri(null);
            setSpotifyAccount(null);
        } catch (error) {
            console.error('Error removing Spotify URI:', error);
        } finally {
            setIsRemoving(false);
        }
    };

    const handleOpenSpotifyUri = () => {
        if (spotifyUri) {
            Linking.openURL(spotifyUri);
        }
    };

    const handleCancel = () => {
        setSpotifyAccount(null);
    };

    const handleSoundCloudInputChange = (text: string) => {
        setSoundCloudInput(text);
        // Check if the input matches the required format
        const isValid = /^https:\/\/on\.soundcloud\.com\/[a-zA-Z0-9]+$/.test(text);
        setIsValidSoundCloudLink(isValid);
    };

    const handleAddSoundCloudUri = async () => {
        if (!isValidSoundCloudLink || !userInfo) return;

        setIsAdding(true);
        try {
            const client = generateClient();
            const { userId } = userInfo;

            const userData = await client.graphql({
                query: getUser,
                variables: { id: userId }
            });

            const currentUser = userData.data.getUser;

            if (!currentUser) {
                console.error('User data not found');
                return;
            }

            await client.graphql({
                query: updateUser,
                variables: {
                    input: {
                        id: userId,
                        soundCloudUri: soundCloudInput,
                        _version: currentUser._version
                    }
                }
            });

            console.log('SoundCloud URI added successfully');
            setSoundCloudUri(soundCloudInput);
            setShowSoundCloudInput(false);
            setSoundCloudInput('');
            setIsValidSoundCloudLink(false);
        } catch (error) {
            console.error('Error adding SoundCloud URI:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemoveSoundCloudUri = async () => {
        if (!userInfo) return;

        setIsRemoving(true);
        try {
            const client = generateClient();
            const { userId } = userInfo;

            const userData = await client.graphql({
                query: getUser,
                variables: { id: userId }
            });

            const currentUser = userData.data.getUser;

            if (!currentUser) {
                console.error('User data not found');
                return;
            }

            await client.graphql({
                query: updateUser,
                variables: {
                    input: {
                        id: userId,
                        soundCloudUri: null,
                        _version: currentUser._version
                    }
                }
            });

            console.log('SoundCloud URI removed successfully');
            setSoundCloudUri(null);
        } catch (error) {
            console.error('Error removing SoundCloud URI:', error);
        } finally {
            setIsRemoving(false);
        }
    };

    const handleAddSoundCloudAccount = () => {
        Alert.alert(
            "How to Add SoundCloud Account",
            "1. Open SoundCloud App\n2. Navigate to your profile\n3. Select the 3 dots in the top right\n4. Choose 'Copy Link'\n5. Paste the link below",
            [
                { text: "OK", onPress: () => setShowSoundCloudInput(true) }
            ]
        );
    };

    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackDrop}
            backgroundStyle={{ backgroundColor: mediumgray }}
            handleIndicatorStyle={{ backgroundColor: light }}
            keyboardBehavior="extend"
            onChange={(index) => setCurrentSnapPoint(index)}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.contentContainer}
                keyboardVerticalOffset={100}
            >
                <Text style={styles.title}>Connect</Text>

                {/* Spotify Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Spotify Account</Text>
                    {spotifyUri ? (
                        <View style={styles.accountRow}>
                            <TouchableOpacity onPress={handleOpenSpotifyUri} style={styles.spotifyIconContainer}>
                                {spotifyImage ? (
                                    <Image 
                                        source={{ uri: spotifyImage }} 
                                        style={styles.profileImage} 
                                    />
                                ) : (
                                    <View style={styles.placeholderImage} />
                                )}
                            </TouchableOpacity>
                            <View style={styles.accountInfo}>
                                <Text style={styles.accountName} numberOfLines={1} ellipsizeMode="tail">
                                    {extractSpotifyUserId(spotifyUri)}
                                </Text>
                                <Text style={styles.accountUri} numberOfLines={1} ellipsizeMode="tail">
                                    {spotifyUri}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.removeButton]} 
                                onPress={handleRemoveSpotifyUri}
                                disabled={isRemoving}
                            >
                                <FontAwesomeIcon icon={faTrash} size={20} color={error} />
                            </TouchableOpacity>
                        </View>
                    ) : spotifyAccount ? (
                        <View style={styles.accountRow}>
                            {spotifyImage ? (
                                <Image 
                                    source={{ uri: spotifyImage }} 
                                    style={styles.profileImage} 
                                />
                            ) : (
                                <View style={styles.placeholderImage} />
                            )}
                            <View style={styles.accountInfo}>
                                <Text style={styles.accountName} numberOfLines={1} ellipsizeMode="tail">
                                    {extractSpotifyUserId(spotifyAccount.externalUrls.spotify)}
                                </Text>
                                <Text style={styles.accountId} numberOfLines={1} ellipsizeMode="tail">
                                    {spotifyAccount.displayName}
                                </Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    style={[styles.textButton, styles.connectButton]} 
                                    onPress={handleAddSpotifyUri}
                                    disabled={isAdding}
                                >
                                    <Text style={styles.connectButtonText}>
                                        {isAdding ? 'Connecting...' : 'Connect'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.cancelButton]} 
                                    onPress={handleCancel}
                                >
                                    <FontAwesomeIcon icon={faX} size={16} color={error} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.addAccountButton} onPress={handleFetchSpotifyAccount}>
                            <FontAwesomeIcon icon={faPlus} size={20} color={light} />
                            <Text style={styles.addAccountButtonText}>Add Spotify Account</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* SoundCloud Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SoundCloud Account</Text>
                    {soundCloudUri ? (
                        <View style={styles.accountRow}>
                            <View style={styles.soundcloudIconContainer}>
                                <FontAwesomeIcon icon={soundcloudIcon} size={30} color={light} />
                            </View>
                            <View style={styles.accountInfo}>
                                <Text style={styles.accountName} numberOfLines={1} ellipsizeMode="tail">
                                    SoundCloud
                                </Text>
                                <Text style={styles.accountUri} numberOfLines={1} ellipsizeMode="tail">
                                    {soundCloudUri}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.removeButton]} 
                                onPress={handleRemoveSoundCloudUri}
                                disabled={isRemoving}
                            >
                                <FontAwesomeIcon icon={faTrash} size={20} color={error} />
                            </TouchableOpacity>
                        </View>
                    ) : showSoundCloudInput ? (
                        <View style={styles.inputContainer}>
                            <View style={styles.inputRow}>
                                <BottomSheetTextInput
                                    style={styles.input}
                                    placeholder="Paste SoundCloud link..."
                                    placeholderTextColor={lgray}
                                    value={soundCloudInput}
                                    onChangeText={handleSoundCloudInputChange}
                                />
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity 
                                        style={[
                                            styles.textButton, 
                                            styles.connectButton,
                                            !isValidSoundCloudLink && styles.disabledButton
                                        ]} 
                                        onPress={handleAddSoundCloudUri}
                                        disabled={!isValidSoundCloudLink || isAdding}
                                    >
                                        <Text style={styles.connectButtonText}>
                                            {isAdding ? 'Adding...' : 'Add'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.actionButton, styles.cancelButton]} 
                                        onPress={() => {
                                            setShowSoundCloudInput(false);
                                            setSoundCloudInput('');
                                            setIsValidSoundCloudLink(false);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faX} size={16} color={error} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {!isValidSoundCloudLink && soundCloudInput !== '' && (
                                <Text style={styles.errorText}>
                                    Please enter a valid SoundCloud link (e.g., https://on.soundcloud.com/nUd67wMAZh4BqnjN7)
                                </Text>
                            )}
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.addAccountButton} onPress={handleAddSoundCloudAccount}>
                            <FontAwesomeIcon icon={faPlus} size={20} color={light} />
                            <Text style={styles.addAccountButtonText}>Add SoundCloud Account</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: light,
        marginBottom: 20,
    },
    section: {
        marginBottom: 10,
        padding: 10,
        // backgroundColor: dark,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: light,
        marginBottom: 10,
        fontStyle: 'italic',
    },
    accountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    spotifyIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1DB954',
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountInfo: {
        flex: 1,
        marginHorizontal: 10,
    },
    accountName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: light,
    },
    accountUri: {
        fontSize: 12,
        color: lgray,
    },
    accountId: {
        fontSize: 12,
        color: lgray,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        // backgroundColor: '#1DB954',
    },
    removeButton: {
        // backgroundColor: 'red',
    },
    addAccountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: gray,
        padding: 10,
        borderRadius: 5,
    },
    addAccountButtonText: {
        color: light,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
    },
    connectButton: {
        backgroundColor: spotifyGreen,
    },
    connectButtonText: {
        color: dark,
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancelButton: {
        backgroundColor: 'transparent',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    soundcloudIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: soundcloudOrange,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginTop: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        flex: 1,
        backgroundColor: dark,
        color: light,
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        marginRight: 10,
    },
    disabledButton: {
        opacity: 0.5,
    },
    errorText: {
        color: error,
        fontSize: 12,
        marginTop: 5,
    },
    placeholderImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: lgray,
    },
});

export default ProfileLinkBottomSheetModal;