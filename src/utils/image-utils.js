// utils.js
export const getImageSource = (item) => {
    switch (item.type) {
      case 'artist':
        return item.images && item.images.length > 0 ? item.images[0].url : null;
      case 'album':
        return item.images && item.images.length > 0 ? item.images[0].url : null;
      case 'track':
        return item.album && item.album.images && item.album.images.length > 0 ? item.album.images[0].url : null;
      default:
        console.log('Unsupported item type:', item.type);
        return null;
    }
  };
  
  