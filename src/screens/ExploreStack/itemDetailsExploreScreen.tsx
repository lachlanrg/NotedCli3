// Currently not working, need to update navigation from explore, and types for ExploreStack


import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExploreStackParamList } from '../../components/types';

import { RankedTrack } from '../../components/exploreAPIs/spotifyTopTracks';
import { RankedSoundCloudTrack } from '../../components/exploreAPIs/scTopTracks';
import { RankedTopTrending } from '../../components/exploreAPIs/topTrendingItems';
import { useNavigation } from '@react-navigation/native';
import { Track } from '../../spotifyConfig/itemInterface';

// Define the type for the item data
type ItemDetailsExploreScreenProps = NativeStackScreenProps<ExploreStackParamList, 'ItemDetailsExplore'>;

const ItemDetailsExploreScreen: React.FC<ItemDetailsExploreScreenProps> = ({ route, navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Item Details</Text>

      {/* Display the item details here */}

      {/* ... display other details based on item type ... */}

      {/* Add a back button to navigate back */}
      <Button title="Go Back" onPress={() => navigation.goBack()} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ItemDetailsExploreScreen;