
const app_config = require("../app_settings").APP_SETTINGS;
const constants = require("../constants").CONSTANTS;

const oauth_credentials = {
  client: {
    id: app_config.mozo_services.oauth2.client.id,
    secret: app_config.mozo_services.oauth2.client.secret
  },
  auth: {
    tokenHost: app_config.mozo_services.oauth2.host,
    tokenPath: "/auth/realms/mozo/protocol/openid-connect/token",
    authorizePath: "/auth/realms/mozo/protocol/openid-connect/auth"
  },
  options: {
    authorizationMethod: 'body',
  }
};

// Initialize the OAuth2 Library
const oauth2 = require('simple-oauth2').create(oauth_credentials);
const userReference = require('electron-settings');

let access_token = null;
let token_header = null;

if (userReference.get(constants.OAUTH2TOKEN_KEY)) {
  access_token = oauth2.accessToken.create(userReference.get("OAuth2Token"));
  token_header = "Bearer " + access_token.token.access_token;
}

async function isTokenValid() {
  if (!access_token) {
    return false;
  }

  if (!access_token.expired()) {
    return true;
  }

  try {
    access_token = await access_token.refresh();
    token_header = "Bearer " + access_token.token.access_token;
    userReference.set("OAuth2Token", access_token.token);
    return true;
  } catch (error) {
    console.log('Error refreshing access token: ', error.message);
    return false;
  }
}

exports.accessToken = async function() {
  if (await isTokenValid()) {
    return access_token;
  } else {
    return null;
  }
};

exports.tokenHeader = async function() {
  if (await isTokenValid()) {
    return token_header;
  } else {
    return null;
  }
}

exports.getTokenFromAuthCode = async function(auth_code, redirect_uri) {
  const token_config = {
    code: auth_code,
    redirect_uri: redirect_uri
  };
  try {
    const result = await oauth2.authorizationCode.getToken(token_config);
    access_token = oauth2.accessToken.create(result);
    userReference.set(constants.OAUTH2TOKEN_KEY, result);
    return access_token;
  } catch (error) {
    console.log('Access Token Error', error.message);
    return null;
  }
};
