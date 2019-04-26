module.exports = {
  excludePrivate: true,
  gaID: process.env.GOOGLE_ANALYTICS_ID,
  gitRevision: 'master',
  mode: 'modules',
  name: 'Cookie Service for Angular',
  out: require('path').join(__dirname, '../doc/api')
};
