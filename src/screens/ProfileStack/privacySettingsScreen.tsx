import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { dark, gray, lgray, light } from '../../components/colorModes';
import { getCurrentUser } from 'aws-amplify/auth';
import { updateUser } from '../../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import { getUser } from '../../graphql/queries';
import { Switch } from 'react-native-gesture-handler';

const PrivacySettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [publicProfileStatus, setPublicProfileStatus] = useState(false);

    const fetchPublicProfileStatus = async () => {
        const client = generateClient();
        try {
            const { userId } = await getCurrentUser();
            const response = await client.graphql({
                query: getUser,
                variables: {
                    id: userId,
                },
            });
            const fetchedPublicProfile = response.data?.getUser?.publicProfile;
            const booleanPublicProfile = fetchedPublicProfile === true;
            setPublicProfileStatus(booleanPublicProfile);
            console.log('Fetched public profile status:', fetchedPublicProfile, 'Converted to:', booleanPublicProfile);
        } catch (error) {
            console.error('Error fetching public profile status:', error);
        }
    };

    useEffect(() => {
        fetchPublicProfileStatus();
    }, []);

    const togglePublicProfile = async () => {
        const client = generateClient();
        try {
            const { userId } = await getCurrentUser();
            const newPublicProfileStatus = !publicProfileStatus;
            
            console.log('Attempting to update publicProfile to:', newPublicProfileStatus);

            const getUserResponse = await client.graphql({
                query: getUser,
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
                        publicProfile: newPublicProfileStatus,
                        _version: currentUser._version,
                    },
                },
            });
            
            const updatedPublicProfile = response.data.updateUser.publicProfile;
            
            console.log('Server returned publicProfile:', updatedPublicProfile);

            setPublicProfileStatus(updatedPublicProfile === true);
            console.log('Profile visibility updated to:', updatedPublicProfile);
        } catch (error) {
            console.error('Error updating profile visibility:', error);
            // Revert the UI state if the update failed
            setPublicProfileStatus(!publicProfileStatus);
        }
    };

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Privacy Settings</Text>
                </View>
                <ScrollView style={styles.content}>
                    <View style={styles.settingGroup}>
                        <Text style={styles.settingGroupTitle}>Profile Visibility</Text>
                        <View style={styles.settingItem}>
                            <View style={styles.settingItemLeft}>
                                <Text style={styles.settingLabel}>Public Profile</Text>
                                <Text style={styles.settingDescription}>
                                    {publicProfileStatus ? 'Your profile is public' : 'Your profile is private'}
                                </Text>
                            </View>
                            <Switch
                                value={publicProfileStatus}
                                onValueChange={togglePublicProfile}
                                trackColor={{ false: gray, true: lgray }}
                                thumbColor={publicProfileStatus ? light : dark}
                            />
                        </View>
                    </View>
                    {/* Add more setting groups here */}
                </ScrollView>
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
        borderBottomWidth: 1,
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
        marginRight: 34,
    },
    content: {
        flex: 1,
    },
    settingGroup: {
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    settingGroupTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: light,
        marginBottom: 10,
        marginTop: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: gray,
    },
    settingItemLeft: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        color: light,
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 12,
        color: light,
        fontStyle: 'italic',
    },
});

export default PrivacySettingsScreen;