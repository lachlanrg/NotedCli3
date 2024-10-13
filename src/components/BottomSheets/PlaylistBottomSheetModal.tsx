import React, { useMemo, forwardRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { dark, light, mediumgray, lgray, spotifyGreen } from "../colorModes";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { SpotifyPlaylist } from '../../API';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollaborationStackParamList } from '../../components/types';

const trashIcon = faTrashCan as IconProp;
const musicIcon = faMusic as IconProp;
const searchIcon = faMagnifyingGlass as IconProp;
const spotifyIcon = faSpotify as IconProp;

type PlaylistBottomSheetModalProps = {
  playlist: SpotifyPlaylist | null;
};

const PlaylistBottomSheetModal = forwardRef<BottomSheetModal, PlaylistBottomSheetModalProps>(
  ({ playlist }, ref) => {
    const navigation = useNavigation<NativeStackNavigationProp<CollaborationStackParamList>>();
    const snapPoints = useMemo(() => ['25%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          onPress={() => (ref as React.RefObject<BottomSheetModal>).current?.dismiss()}
        />
      ),
      []
    );

    const handleOpenInSpotify = useCallback(() => {
      if (playlist && playlist.spotifyExternalUrl) {
        Linking.openURL(playlist.spotifyExternalUrl);
      }
    }, [playlist]);

    const handleViewDetails = useCallback(() => {
      if (playlist && playlist.spotifyPlaylistId) {
        navigation.navigate('ViewPlaylist', { playlistId: playlist.spotifyPlaylistId });
        (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
      } else {
        console.error('Spotify Playlist ID is undefined:', playlist);
        Alert.alert('Error', 'Unable to view this playlist. Please try again later.');
      }
    }, [playlist, navigation]);

    const handleDelete = useCallback(() => {
      // Implement delete functionality
      console.log("Delete playlist");
    }, []);

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenInSpotify}>
            <FontAwesomeIcon icon={spotifyIcon} size={24} color={spotifyGreen} />
            <Text style={styles.actionText}>Open in Spotify</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleViewDetails}>
            <FontAwesomeIcon icon={searchIcon} size={24} color={light} />
            <Text style={styles.actionText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <FontAwesomeIcon icon={trashIcon} size={24} color={light} />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: mediumgray,
  },
  handleIndicator: {
    backgroundColor: lgray,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: light,
  },
});

export default PlaylistBottomSheetModal;
