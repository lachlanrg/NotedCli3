// SearchPostBottomSheetModal.tsx
import React, { useMemo, forwardRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { dark, gray, lgray, light, modalBackground } from "../colorModes";
import { scTrack } from "../../soundcloudConfig/itemInterface";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Track, Album, Artist } from "../../spotifyConfig/itemInterface";

const musicIcon = faMusic as IconProp;
const searchIcon = faMagnifyingGlass as IconProp;

type RootStackParamList = {
  PostSpotifyTrack: { track: Track };
  PostSCTrack: { sctrack: scTrack };
  PostSpotifyAlbum: { album: Album };
  SearchSpotifyAlbum: { albumId: string };
  SearchSpotifyTrack: { trackId: string };
  SearchSpotifyArtist: { artistId: string };
  SearchSCTrack: { trackId: string };
  // ... other routes
};

export type Ref = BottomSheetModal;

interface SearchPostBottomSheetProps {
    item: Track | scTrack | Album | Artist | null;
    onClose: () => void;
}

const SearchPostBottomSheetModal = forwardRef<BottomSheetModal, SearchPostBottomSheetProps>(({ item, onClose }, ref) => { 
    const snapPoints = useMemo(() => ['25%'], []);
    const navigation = useNavigation<any>();

    const renderBackDrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const { dismiss } = useBottomSheetModal();

    const handleDismiss = () => {
        onClose();
        dismiss();
    };

    const isSpotifyTrack = (item: any): item is Track => {
        return item && typeof item === 'object' && 'type' in item && item.type === 'track';
    };

    const isSpotifyAlbum = (item: any): item is Album => {
        return item && typeof item === 'object' && 'type' in item && item.type === 'album';
    };

    const isSpotifyArtist = (item: any): item is Artist => {
        return item && typeof item === 'object' && 'type' in item && item.type === 'artist';
    };

    const isSoundCloudTrack = (item: any): item is scTrack => {
        return item && typeof item === 'object' && 'kind' in item && item.kind === 'track';
    };

    const handlePostPress = () => {
        if (item) {
            if (isSpotifyTrack(item)) {
                navigation.navigate('PostSpotifyTrack', { track: item });
            } else if (isSpotifyAlbum(item)) {
                navigation.navigate('PostSpotifyAlbum', { album: item });
            } else if (isSoundCloudTrack(item)) {
                navigation.navigate('PostSCTrack', { sctrack: item });
            }
        }
        handleDismiss();
    };

    const handleSearchPress = () => {
        if (item) {
            if (isSpotifyAlbum(item)) {
                navigation.navigate('SearchSpotifyAlbum', { albumId: item.id });
            } else if (isSpotifyTrack(item)) {
                navigation.navigate('SearchSpotifyTrack', { trackId: item.id });
            } else if (isSpotifyArtist(item)) {
                navigation.navigate('SearchSpotifyArtist', { artistId: item.id });
            } else if (isSoundCloudTrack(item)) {
                navigation.navigate('SearchSCTrack', { trackId: item.id });
            }
        }
        handleDismiss();
    };

    return (
        <BottomSheetModal
            ref={ref}
            index={0} 
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackDrop}
            backgroundStyle={{ backgroundColor: modalBackground }}
        >
            <View style={styles.contentContainer}>
                {item && (
                    <>
                        <Text style={styles.trackTitle}>
                            {isSpotifyTrack(item) || isSpotifyAlbum(item) || isSpotifyArtist(item) ? item.name : 'title' in item ? item.title : ''}
                        </Text>
                        <Text style={styles.artistName}>
                            {isSpotifyTrack(item) 
                                ? item.artists.map(artist => artist.name).join(', ')
                                : isSpotifyAlbum(item)
                                    ? item.artists.map(artist => artist.name).join(', ')
                                    : isSpotifyArtist(item)
                                        ? 'Artist'
                                        : 'publisher_metadata' in item && item.publisher_metadata.artist
                                            ? item.publisher_metadata.artist
                                            : 'Unknown Artist'
                            }
                        </Text>
                    </>
                )}
                <View style={styles.iconRow}>
                    <TouchableOpacity 
                        style={styles.searchButton} 
                        onPress={handleSearchPress}
                        disabled={!isSpotifyAlbum(item) && !isSpotifyTrack(item) && !isSpotifyArtist(item) && !isSoundCloudTrack(item)}
                    >
                        <FontAwesomeIcon 
                            icon={searchIcon} 
                            size={24} 
                            color={(isSpotifyAlbum(item) || isSpotifyTrack(item) || isSpotifyArtist(item) || isSoundCloudTrack(item)) ? dark : gray} 
                        /> 
                    </TouchableOpacity>
                    {!isSpotifyArtist(item) && (
                        <TouchableOpacity style={styles.postButton} onPress={handlePostPress}>
                            <Text style={styles.postButtonText}>Post</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    iconRow: {
        flexDirection: 'row',        
        alignItems: 'center',
        justifyContent: 'space-between',
      },
    searchButton: {
        borderWidth: 1,
        borderColor: lgray,
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 20,
        marginRight: 40,
    },
    trackTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: dark,
        marginBottom: 8,
        textAlign: 'center',
    },
    artistName: {
        fontSize: 16,
        color: dark,
        marginBottom: 16,
        textAlign: 'center',
    },
    postButton: {
        backgroundColor: '#1DB954',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginLeft: 40,
    },
    postButtonText: {
        color: light,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SearchPostBottomSheetModal;

