
/* const blacklist = require('metro-config/src/defaults/blacklist');

export default {
  getBlacklistRE: () => blacklist([
    /desktop\/,
  ])
}; */


const blacklist = require('metro').createBlacklist;

module.exports = {
  getBlacklistRE: function() {
    return blacklist([/desktop\/.*/]);
  }
};