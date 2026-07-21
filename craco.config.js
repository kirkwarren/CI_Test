const webpack = require('webpack');

// The Anthropic SDK's Node-only credential code imports "node:fs" etc.
// CRA's webpack can't resolve the node: scheme, and none of that code runs in
// the browser — strip the prefix and stub the builtins out.
module.exports = {
  webpack: {
    configure: (config) => {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        }),
      );
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        'fs/promises': false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        'stream/promises': false,
        util: false,
        child_process: false,
        readline: false,
      };
      return config;
    },
  },
};
