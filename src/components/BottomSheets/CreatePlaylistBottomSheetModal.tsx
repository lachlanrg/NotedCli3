import React, { useMemo, forwardRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { dark, light, lgray, mediumgray } from '../../components/colorModes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollaborationStackParamList } from '../types';

type CreatePlaylistBottomSheetModalProps = {
  navigation: NativeStackNavigationProp<CollaborationStackParamList, 'Collaboration'>;
};

const CreatePlaylistBottomSheetModal = forwardRef<BottomSheetModal, CreatePlaylistBottomSheetModalProps>(
  ({ navigation }, ref) => {
    const snapPoints = useMemo(() => ['25%'], []);

    const handleAddExistingPlaylist = () => {
      navigation.navigate('UsersSpotifyPlaylists');
      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    };

    const handleCreateCollabPlaylist = () => {
      navigation.navigate('CreateCollabPlaylist');
      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    };

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
          <TouchableOpacity style={styles.option} onPress={handleAddExistingPlaylist}>
            <Text style={styles.optionText}>Add existing playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={handleCreateCollabPlaylist}>
            <Text style={styles.optionText}>Create Collab Playlist</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  option: {
    width: '90%',
    paddingVertical: 15,
  },
  optionText: {
    color: light,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CreatePlaylistBottomSheetModal;
