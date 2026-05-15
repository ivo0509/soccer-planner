const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Exclude the root node_modules from the watchlist
config.watchFolders = [
  path.resolve(__dirname),
];

// Ignore the root node_modules directory
config.resolver.blacklistRE = /node_modules\/.*\/node_modules/;

module.exports = config;
