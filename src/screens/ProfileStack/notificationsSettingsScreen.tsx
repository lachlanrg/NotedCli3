import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { dark, gray, light } from '../../components/colorModes';
import { generateClient } from 'aws-amplify/api';
import { listNotificationSettings } from '../../graphql/queries'; // Import the generated query
import { updateNotificationSettings } from '../../graphql/mutations';
import { getCurrentUser } from '@aws-amplify/auth';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { useNotification } from '../../context/NotificationContext';

// Update the NotificationSettings interface
interface NotificationSettings {
  id: string;
  userId: string;
  likeEnabled: boolean;
  commentEnabled: boolean;
  followRequestEnabled: boolean;
  repostEnabled: boolean;
  commentLikeEnabled: boolean;
  approvalEnabled: boolean;
  inAppEnabled: boolean;
  _version: number;
}

type UpdatableSettingKey = Exclude<keyof NotificationSettings, 'id' | 'userId'>;

const NotificationsSettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { updateInAppEnabled } = useNotification();
    const [settings, setSettings] = useState<NotificationSettings>({
        id: '',
        userId: '',
        likeEnabled: true,
        commentEnabled: true,
        followRequestEnabled: true,
        repostEnabled: true,
        commentLikeEnabled: true,
        approvalEnabled: true,
        inAppEnabled: true,
        _version: 1,
    });

    const client = generateClient();

    useEffect(() => {
        fetchNotificationSettings();
    }, []);

    const fetchNotificationSettings = async () => {
        try {
            const { userId } = await getCurrentUser();
            const settingsData = await client.graphql({
                query: listNotificationSettings,
                variables: { 
                    filter: { userId: { eq: userId } }
                }
            }) as GraphQLResult<{
                listNotificationSettings: {
                    items: NotificationSettings[];
                }
            }>;
            
            if (settingsData.data?.listNotificationSettings.items.length > 0) {
                setSettings(settingsData.data.listNotificationSettings.items[0]);
            } else {
                console.error('No notification settings found for user');
            }
        } catch (error) {
            console.error('Error fetching notification settings:', error);
        }
    };

    const updateSetting = async (key: UpdatableSettingKey, value: boolean) => {
        try {
            const updatedSettings = { ...settings, [key]: value };
            setSettings(updatedSettings);

            const result = await client.graphql({
                query: updateNotificationSettings,
                variables: {
                    input: {
                        id: settings.id,
                        [key]: value,
                        _version: settings._version
                    }
                }
            }) as GraphQLResult<{
                updateNotificationSettings: NotificationSettings;
            }>;

            if (result.data?.updateNotificationSettings) {
                setSettings(result.data.updateNotificationSettings);
                if (key === 'inAppEnabled') {
                    updateInAppEnabled(value);
                }
            }
        } catch (error) {
            console.error('Error updating notification setting:', error);
            setSettings(settings);
        }
    };

    const toggleAllNotifications = async (enabled: boolean) => {
        try {
            const updatedSettings = {
                likeEnabled: enabled,
                commentEnabled: enabled,
                followRequestEnabled: enabled,
                repostEnabled: enabled,
                commentLikeEnabled: enabled,
                approvalEnabled: enabled,
                inAppEnabled: enabled,
            };

            const result = await client.graphql({
                query: updateNotificationSettings,
                variables: {
                    input: {
                        id: settings.id,
                        ...updatedSettings,
                        _version: settings._version
                    }
                }
            }) as GraphQLResult<{
                updateNotificationSettings: NotificationSettings;
            }>;

            if (result.data?.updateNotificationSettings) {
                setSettings(result.data.updateNotificationSettings);
                updateInAppEnabled(enabled);
            }
        } catch (error) {
            console.error('Error updating all notification settings:', error);
            setSettings(settings);
        }
    };

    const allNotificationsEnabled = Object.values(settings).every(
        (value) => value === true || typeof value !== 'boolean'
    );

    const renderSettingItem = (label: string, key: UpdatableSettingKey) => (
        <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{label}</Text>
            <Switch
                value={Boolean(settings[key])}
                onValueChange={(value) => updateSetting(key, value)}
                trackColor={{ false: gray, true: '#4CAF50' }}
                thumbColor={Boolean(settings[key]) ? '#fff' : '#f4f3f4'}
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
                    <View style={styles.globalToggleContainer}>
                        <Text style={styles.globalToggleLabel}>All Notifications</Text>
                        <Switch
                            value={allNotificationsEnabled}
                            onValueChange={toggleAllNotifications}
                            trackColor={{ false: gray, true: '#4CAF50' }}
                            thumbColor={allNotificationsEnabled ? '#fff' : '#f4f3f4'}
                        />
                    </View>
                    
                    <Text style={styles.sectionTitle}>General</Text>
                    {renderSettingItem('In App Notifications', 'inAppEnabled')}
                    
                    <Text style={styles.sectionTitleActivity}>Activity</Text>
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
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: light,
        marginBottom: 10,
    },
    sectionTitleActivity: {
        fontSize: 22,
        fontWeight: 'bold',
        color: light,
        marginBottom: 10,
        marginTop: 20,
    },
    globalToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: gray,
        marginBottom: 20,
    },
    globalToggleLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: light,
    },
});

export default NotificationsSettingsScreen;