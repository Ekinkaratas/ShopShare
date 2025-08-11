module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['expo',
      'module:metro-react-native-babel-preset',
      'module:@react-native/babel-preset'
    ],
    plugins: ['react-native-reanimated/plugin',
      'react-native-paper/babel',
      'module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      }
    ],
  };
};