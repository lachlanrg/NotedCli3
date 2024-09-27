// ../spotifyConfig/itemInterface.tsx
// Exporting types to be used in other files
export interface Album {
    id: string;
    name: string;
    album_type: string;
    images: { url: string }[]; 
    release_date: string;
    artists: { name: string }[];
    total_tracks: string;
    external_urls: { spotify: string };
  }
  
  export interface AlbumOnly {
    name: string;
    id: string;
    type: string;
    artists: { name: string }[];
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    images: { url: string }[];
    external_urls: { spotify: string };
    href: string;
    uri: string;
  }
  export interface Artist {
    name: string;
    id: string;
    type: string;
    images: { url: string }[];
    popularity: number; 
  }
  
  export interface Track {
    name: string, 
    id: string, 
    type: string, 
    album: { name: string, release_date: string, images: { url: string }[] }, 
    artists: { name: string }[],
    popularity: number; 
    preview_url: string,
    external_urls: { spotify: string },
    duration_ms: number,
    explicit: boolean,
  }
  
  export interface SearchResult {
    type: string;
    name: string;
    id: string;
    images: { url: string }[];  
    release_date: string;
    artist: string;
    album?: {
      images: { url: string }[];
    };
  }
  