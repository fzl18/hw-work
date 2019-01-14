
module.exports = {
  apps : [
      {
          name: 'dataapi-live',
          script: './live.js',
          args: '--max-old-space-size=1024',
      },
      {
        name: 'dataapi-http',
        script: './http.js',
        args: '--max-old-space-size=1024',
      }
  ],
};

