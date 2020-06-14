module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        import: ['~@/styles/shared.styl']
      }
    }
  },

  pwa: {
    themeColor: '#BDD544',
    name: 'heartbeet',
    msTileColor: '#BDD544',
    manifestOptions: {
      background_color: '#ffffff'
    }
  },

  outputDir: 'docs'
}
