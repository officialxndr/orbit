module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo wires up expo-router and react-native-worklets/reanimated
    // automatically for SDK 56, so no extra plugins are needed here.
    presets: ['babel-preset-expo'],
  };
};
