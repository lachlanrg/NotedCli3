//scrollRefresh.tsx
import React, { useRef, useState } from "react";
import { Animated } from "react-native";

// Used for Profile
export const [refreshing, setRefreshing] = useState(false);



// Put animated view in each screen and create onRefresh const for onScroll function