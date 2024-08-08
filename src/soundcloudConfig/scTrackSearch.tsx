// ./scTrackSearch.tsx
import { useState } from 'react';
import { scTrack } from './itemInterface';

export async function searchSCTracks(searchInput: string, saveRecentSearch: any, offset: number): Promise<scTrack[]> {
    saveRecentSearch(searchInput);

    const client_id = "lPP5wRG1UkRxNZhnYd7OVc4umoqzySTZ"
    const limit = '15'

    console.log("SoundCloud Search input: " + searchInput);
  
    try {
      const response = await fetch('https://api-v2.soundcloud.com/search/tracks?q=' + searchInput + "&client_id=" + client_id + "&limit=" + limit + "&offset=" + offset + "&linked_partitioning=1");
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      var searchSCData = await response.json();

      const keyInfo = searchSCData.collection.map((sctrack: scTrack) => ({
        artwork_url: sctrack.artwork_url,
        release_date: sctrack.release_date,
        id: sctrack.id,
        genre: sctrack.genre,
        likes_count: sctrack.likes_count,
        permalink_url: sctrack.permalink_url,
        playback_count: sctrack.playback_count,
        title: sctrack.title,
        user_id: sctrack.user_id,
        kind: sctrack.kind,
        waveform_url: sctrack.waveform_url,
      }));
      
    //   console.log('--------------------------------------------'); 
    //   console.log('SC Search Data:');
    //   console.log('\n'); 

    //     keyInfo.forEach((sctrack: scTrack) => {
    //         console.log(`Artwork URL: ${sctrack.artwork_url}`);
    //         console.log(`Genre: ${sctrack.genre}`);
    //         console.log(`ID: ${sctrack.id}`);
    //         console.log(`Kind: ${sctrack.kind}`);
    //         console.log(`Likes Count: ${sctrack.likes_count}`);
    //         console.log(`Permalink URL: ${sctrack.permalink_url}`);
    //         console.log(`Playback Count: ${sctrack.playback_count}`);
    //         console.log(`Release Date: ${sctrack.release_date}`);
    //         console.log(`Title: ${sctrack.title}`);
    //         console.log(`User ID: ${sctrack.user_id}`);
    //         console.log('\n'); 
    //         console.log('--------------------------------------------'); 

    //     });
    //     console.log('--------------------------------------------'); 

        return keyInfo; // Return the array of SoundCloud tracks

      // Process searchData as needed
    } catch (error) {
      console.error('Error fetching search results:', error);
      return []; 
    }
  }