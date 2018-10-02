
const oauth2 = require('./oauth2');
const app_config = require("../app_settings").APP_SETTINGS;
const mozo_service_host = app_config.mozo_services.api.host;

var Common = {
  'setRequestData' : function() {
    let token_header = oauth2.tokenHeader();
    if (!token_header) {
      return null;
    }
    let options = {
      url: mozo_service_host + "/api/user-profile",
      headers: {
        'Authorization' : token_header
      },
      method: 'GET'
    };
    return options;
  }
};

module.exports = Common;
