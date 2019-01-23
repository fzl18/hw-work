module.exports = {
    outputDir:'dist/web',
    runtimeCompiler:true,
    pages: {
        index: {
          entry: 'src/renderer/main.js',
          template: 'src/index.html',
          filename: 'index.html',
          title: 'Index Page',
          chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
      }
}