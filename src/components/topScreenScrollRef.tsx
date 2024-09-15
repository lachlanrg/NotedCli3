import { useRef } from "react";
import { ScrollView, FlatList } from "react-native";

// For ScrollViews
export const scrollViewRef = useRef<ScrollView>(null);
export const handleTopScrollViewPress = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

/*
    In ScrollView, instert:
        
        ref={scrollViewRef}

*/


// For FlatLists
export const flatListRef = useRef<FlatList>(null);
export const handleTopFlatListPress = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

/*
    In FlatList, instert:
    
        ref={flatListRef}
*/


/*

    In Return Statement under Container, insert: 

        <TouchableOpacity style={styles.topButton} onPress={ handleTopScrollViewPress / handleTopFlatListPress }>
            <View style={styles.topButtonArea} />
        </TouchableOpacity>


    In styles, insert:

        topButton: {
            position: 'absolute',
            alignItems: 'center',
            top: 0,
            left: '36%',
            height: 50,
            width: 100,
            zIndex: 1,
            borderColor: 'white',
            borderWidth: 0.5,
        },
        topButtonArea: {
            flex: 1,
        },

*/

