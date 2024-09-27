import { useState, useEffect, useCallback } from 'react';
import { scTrack } from './itemInterface';

const useSCTrackById = () => {
    const [clientId, setClientId] = useState('ntjK0JIlh0TWD3YGLaKMP0QR6KSxdMki');

    const getSCTrackById = useCallback(async (id: string): Promise<scTrack | null> => {
        try {
            const response = await fetch(`https://api-v2.soundcloud.com/tracks/${id}?client_id=${clientId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch SoundCloud track');
            }

            const fullData = await response.json();
            
            // Extract only the fields you need
            const simplifiedData: scTrack = {
                id: fullData.id,
                title: fullData.title,
                artwork_url: fullData.artwork_url,
                created_at: fullData.created_at,
                genre: fullData.genre,
                likes_count: fullData.likes_count,
                permalink_url: fullData.permalink_url,
                playback_count: fullData.playback_count,
                user_id: fullData.user_id,
                kind: fullData.kind,
                waveform_url: fullData.waveform_url,
                publisher_metadata: {
                    artist: fullData.publisher_metadata?.artist || '',
                    contains_music: fullData.publisher_metadata?.contains_music || false,
                    isrc: fullData.publisher_metadata?.isrc || '',
                    explicit: fullData.publisher_metadata?.explicit || false,
                    writer_composer: fullData.publisher_metadata?.writer_composer || '',
                },
                user: {
                    avatar_url: fullData.user?.avatar_url || '',
                    username: fullData.user?.username || '',
                    verified: fullData.user?.verified || false,
                },
            };

            return simplifiedData;
        } catch (error) {
            console.error('Error fetching SoundCloud track:', error);
            return null;
        }
    }, [clientId]);

    return { getSCTrackById };
};

export default useSCTrackById;