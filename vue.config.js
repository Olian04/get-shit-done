module.exports = {
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/get-shit-done/'
    : '/',
  pwa: {}
};
