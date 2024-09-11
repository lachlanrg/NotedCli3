import React, { useMemo, forwardRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { dark, light } from "../colorModes";
import { Track } from "../../spotifyConfig/itemInterface";
import { scTrack } from "../../soundcloudConfig/itemInterface";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  PostSpotifyTrack: { track: Track };
  PostSCTrack: { sctrack: scTrack };
  // ... other routes
};


export type Ref = BottomSheetModal;

interface SearchPostBottomSheetProps {
    item: Track | scTrack | null;
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
        return 'artists' in item;
    };

    const handlePostPress = () => {
        if (item) {
            if (isSpotifyTrack(item)) {
                navigation.navigate('PostSpotifyTrack', { track: item });
            } else {
                navigation.navigate('PostSCTrack', { sctrack: item });
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
        >
            <View style={styles.contentContainer}>
                {item && (
                    <>
                        <Text style={styles.trackTitle}>
                            {isSpotifyTrack(item) ? item.name : item.title}
                        </Text>
                        <Text style={styles.artistName}>
                            {isSpotifyTrack(item) 
                                ? item.artists.map(artist => artist.name).join(', ')
                                : item.user_id
                            }
                        </Text>
                    </>
                )}
                <TouchableOpacity style={styles.postButton} onPress={handlePostPress}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: light,
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
        marginTop: 16,
    },
    postButtonText: {
        color: light,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SearchPostBottomSheetModal;

