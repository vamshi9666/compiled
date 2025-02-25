module.exports = {
  plugins: [['@compiled/react/babel-plugin', { nonce: '"k0Mp1lEd"', importReact: false }]],
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
