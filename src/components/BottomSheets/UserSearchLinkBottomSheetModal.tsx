import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { light, mediumgray, dark, gray, lgray, spotifyGreen, soundcloudOrange } from '../colorModes';
import { generateClient } from 'aws-amplify/api';
import { getUser } from '../../graphql/queries';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const spotifyIcon = faSpotify as IconProp;
const soundcloudIcon = faSoundcloud as IconProp;

export type Ref = BottomSheetModal;

interface Props {
  userId: string;
}

const UserSearchLinkBottomSheetModal = forwardRef<Ref, Props>(({ userId }, ref) => {
  const [spotifyUri, setSpotifyUri] = useState<string | null>(null);
  const [soundCloudUri, setSoundCloudUri] = useState<string | null>(null);
  const [spotifyImage, setSpotifyImage] = useState<string | null>(null);
  
  const snapPoints = useMemo(() => {
    const connectedLinksCount = [spotifyUri, soundCloudUri].filter(Boolean).length;
    switch (connectedLinksCount) {
      case 0:
      case 1:
        return ['30%'];
      case 2:
        return ['40%'];
      default:
        return ['25%'];
    }
  }, [spotifyUri, soundCloudUri]);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const client = generateClient();
      const userData = await client.graphql({
        query: getUser,
        variables: { id: userId }
      });

      setSpotifyUri(userData.data.getUser?.spotifyUri || null);
      setSoundCloudUri(userData.data.getUser?.soundCloudUri || null);
      setSpotifyImage(userData.data.getUser?.spotifyImage || null);
    } catch (err) {
      console.log('Error fetching user data:', err);
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  const handleLinkPress = (uri: string) => {
    Linking.openURL(uri);
  };

  const extractSpotifyUserId = (uri: string) => {
    return uri.split('/').pop() || 'Unknown';
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: mediumgray }}
      handleIndicatorStyle={{ backgroundColor: light }}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Connect</Text>

        {(spotifyUri || soundCloudUri) ? (
          <>
            {/* Spotify Section */}
            {spotifyUri && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Spotify Account</Text>
                <TouchableOpacity style={styles.accountRow} onPress={() => handleLinkPress(spotifyUri)}>
                  <View style={styles.spotifyIconContainer}>
                    {spotifyImage ? (
                      <Image 
                        source={{ uri: spotifyImage }} 
                        style={styles.profileImage} 
                      />
                    ) : (
                      <FontAwesomeIcon icon={spotifyIcon} size={30} color={light} />
                    )}
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName} numberOfLines={1} ellipsizeMode="tail">
                      {extractSpotifyUserId(spotifyUri)}
                    </Text>
                    <Text style={styles.accountUri} numberOfLines={1} ellipsizeMode="tail">
                      {spotifyUri}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* SoundCloud Section */}
            {soundCloudUri && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SoundCloud Account</Text>
                <TouchableOpacity style={styles.accountRow} onPress={() => handleLinkPress(soundCloudUri)}>
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
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.noLinksText}>No links available</Text>
        )}
      </View>
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
    padding: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: light,
    fontStyle: 'italic',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  spotifyIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: spotifyGreen,
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
  accountInfo: {
    flex: 1,
    marginLeft: 15,
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
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  noLinksText: {
    fontSize: 16,
    color: lgray,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default UserSearchLinkBottomSheetModal;