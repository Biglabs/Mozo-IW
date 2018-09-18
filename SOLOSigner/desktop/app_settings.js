
const APP_SETTINGS = {
  app: {
    deeplink: "solosigner"
  },

  proxy_server: {
    host: "127.0.0.1",
    port: 33013
  },

  mozo_services: {
    api: {
      host: "http://18.136.55.245:8080/solomon"
    },
    oauth2: {
      host: "https://dev.keycloak.mozocoin.io",
      client: {
        id: "desktop_app",
        secret: "4546b9b1-5fcc-48b6-9922-a8ad9789fb71"
      }
    }
  }
};

exports.APP_SETTINGS = APP_SETTINGS;
