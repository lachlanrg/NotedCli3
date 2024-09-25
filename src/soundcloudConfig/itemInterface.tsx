export interface scTrack {
    artwork_url: string;
    release_date: string;
    id: string;
    genre: string;
    likes_count: number;
    permalink_url: string;
    playback_count: number;
    title: string;
    user_id: string;
    kind: string;
    waveform_url: string;
    publisher_metadata: {
        artist: string;
        contains_music: boolean;
        isrc: string;
        explicit: boolean;
        writer_composer: string;
    };
    user: {
        avatar_url: string;
        username: string;
        verified: boolean;
    };
}