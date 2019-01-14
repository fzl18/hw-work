
module.exports = {
  apps : [
      {
        name: 'sdchain-monitor',
        script: './index.js',
        args: '--max-old-space-size=1024',
    }
  ],
};

