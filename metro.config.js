const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  crypto: require.resolve('react-native-get-random-values'),
  url: require.resolve('react-native-url-polyfill'),
  stream: require.resolve('readable-stream'),
  buffer: require.resolve('buffer'),
  util: require.resolve('util'),
  process: require.resolve('process/browser'),
};

module.exports = config; 