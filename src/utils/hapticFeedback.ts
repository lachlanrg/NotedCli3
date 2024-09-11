import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const lightImpact = () => {
  ReactNativeHapticFeedback.trigger("impactLight", options);
};

export const mediumImpact = () => {
  ReactNativeHapticFeedback.trigger("impactMedium", options);
};

export const heavyImpact = () => {
  ReactNativeHapticFeedback.trigger("impactHeavy", options);
};

export const selectionChange = () => {
  ReactNativeHapticFeedback.trigger("selection", options);
};

export const notificationSuccess = () => {
  ReactNativeHapticFeedback.trigger("notificationSuccess", options);
};

export const notificationWarning = () => {
  ReactNativeHapticFeedback.trigger("notificationWarning", options);
};

export const notificationError = () => {
  ReactNativeHapticFeedback.trigger("notificationError", options);
};

// You can add more custom haptic patterns if needed
export const customPattern = () => {
  ReactNativeHapticFeedback.trigger("impactMedium", options);
  setTimeout(() => ReactNativeHapticFeedback.trigger("impactLight", options), 100);
  setTimeout(() => ReactNativeHapticFeedback.trigger("impactHeavy", options), 200);
};