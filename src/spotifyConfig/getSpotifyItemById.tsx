import { useState, useEffect, useCallback } from 'react';
import { CLIENT_ID, CLIENT_SECRET } from '../config';
import { Track } from './itemInterface';


const useSpotifyItemById = () => {
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const authParameters = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
                };

                const response = await fetch('https://accounts.spotify.com/api/token', authParameters);
                const data = await response.json();
                setAccessToken(data.access_token);
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        };

        fetchAccessToken();
    }, []);

    const getSpotifyTrackById = useCallback(async (id: string) => {
        if (!accessToken) {
            console.log('Access token not available yet');
            return null;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Spotify track');
            }

            const fullData = await response.json();
            
            // Extract only the fields you need
            const simplifiedData = {
                id: fullData.id,
                name: fullData.name,
                artists: fullData.artists.map((artist: any) => ({
                    id: artist.id,
                    name: artist.name,
                    external_urls: artist.external_urls.spotify,
                })),
                album: {
                    id: fullData.album.id,
                    name: fullData.album.name,
                    images: fullData.album.images, // Keep the entire images array
                    release_date: fullData.album.release_date,
                    total_tracks: fullData.album.total_tracks,
                    album_type: fullData.album.album_type,
                    external_urls: fullData.album.external_urls.spotify,
                },
                duration_ms: fullData.duration_ms,
                popularity: fullData.popularity,
                preview_url: fullData.preview_url,
                external_urls: fullData.external_urls,
                track_number: fullData.track_number,
                uri: fullData.uri,
            };

            return simplifiedData;
        } catch (error) {
            console.error('Error searching:', error);
            return null;
        }
    }, [accessToken]);

    const getSpotifyAlbumById = useCallback(async (albumId: string) => {
        if (!accessToken) {
            console.log('Access token not available yet');
            return null;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Spotify album');
            }

            const fullData = await response.json();
            
            // Extract only the fields you need
            const simplifiedData = {
                id: fullData.id,
                name: fullData.name,
                artists: fullData.artists.map((artist: any) => ({
                    id: artist.id,
                    name: artist.name,
                    external_urls: artist.external_urls.spotify,
                })),
                images: fullData.images,
                release_date: fullData.release_date,
                total_tracks: fullData.total_tracks,
                album_type: fullData.album_type,
                external_urls: fullData.external_urls,
                popularity: fullData.popularity,
                label: fullData.label,
                genres: fullData.genres,
                tracks: {
                    items: fullData.tracks.items.map((track: any) => ({
                        id: track.id,
                        name: track.name,
                        artists: track.artists.map((artist: any) => ({
                            id: artist.id,
                            name: artist.name,
                        })),
                        duration_ms: track.duration_ms,
                        track_number: track.track_number,
                        preview_url: track.preview_url,
                        external_urls: track.external_urls,
                    })),
                },
                copyrights: fullData.copyrights,
                uri: fullData.uri,
            };

            return simplifiedData;
        } catch (error) {
            console.error('Error fetching Spotify album:', error);
            return null;
        }
    }, [accessToken]);

    return { getSpotifyTrackById, getSpotifyAlbumById };
};

export default useSpotifyItemById;