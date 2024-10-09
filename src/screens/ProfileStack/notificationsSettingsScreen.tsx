import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { dark, gray, light } from '../../components/colorModes';
import { generateClient } from 'aws-amplify/api';
import { getNotificationSettings } from '../../graphql/queries';
import { updateNotificationSettings } from '../../graphql/mutations';
import { getCurrentUser } from '@aws-amplify/auth';

const NotificationsSettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [settings, setSettings] = useState({
        likeEnabled: true,
        commentEnabled: true,
        followRequestEnabled: true,
        repostEnabled: true,
        commentLikeEnabled: true,
        approvalEnabled: true,
    });

    const client = generateClient();

    useEffect(() => {
        fetchNotificationSettings();
    }, []);

    const fetchNotificationSettings = async () => {
        try {
            const { userId } = await getCurrentUser();
            const settingsData = await client.graphql({
                query: getNotificationSettings,
                variables: { id: userId }
            });
            
            if (settingsData.data.getNotificationSettings) {
                setSettings(settingsData.data.getNotificationSettings);
            } else {
                console.error('No notification settings found for user');
            }
        } catch (error) {
            console.error('Error fetching notification settings:', error);
        }
    };

    const updateSetting = async (key: string, value: boolean) => {
        try {
            const { userId } = await getCurrentUser();
            const updatedSettings = { ...settings, [key]: value };
            setSettings(updatedSettings);

            await client.graphql({
                query: updateNotificationSettings,
                variables: {
                    input: {
                        id: userId,
                        [key]: value,
                    }
                }
            });
        } catch (error) {
            console.error('Error updating notification setting:', error);
        }
    };

    const renderSettingItem = (label: string, key: string) => (
        <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{label}</Text>
            <Switch
                value={settings[key as keyof typeof settings]}
                onValueChange={(value) => updateSetting(key, value)}
                trackColor={{ false: gray, true: '#4CAF50' }}
                thumbColor={settings[key as keyof typeof settings] ? '#fff' : '#f4f3f4'}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications Settings</Text>
                </View>
                <View style={styles.content}>
                    {renderSettingItem('Likes', 'likeEnabled')}
                    {renderSettingItem('Comments', 'commentEnabled')}
                    {renderSettingItem('Follow Requests', 'followRequestEnabled')}
                    {renderSettingItem('Reposts', 'repostEnabled')}
                    {renderSettingItem('Comment Likes', 'commentLikeEnabled')}
                    {renderSettingItem('Approvals', 'approvalEnabled')}
                </View>
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
        padding: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: gray,
    },
    settingLabel: {
        fontSize: 16,
        color: light,
    },
});

export default NotificationsSettingsScreen;