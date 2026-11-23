// Expo SDK 52+ 는 pnpm 모노레포를 자동 감지하므로 별도 watchFolders 설정이 필요 없다.
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// withUniwindConfig 는 반드시 가장 바깥 래퍼여야 한다
module.exports = withUniwindConfig(config, {
  cssEntryFile: './src/global.css',
  dtsFile: './src/uniwind-types.d.ts',
});
