import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Keycloak from 'keycloak-js';

import {colorPrimary, colorScreenBackground, dimenScreenWidth, icons} from '../../res';
import {Button, SvgView, Text} from "../components";
import { strings } from '../../helpers/i18nUtils';

import Globals from '../../services/GlobalService';


export default class KeyCloakScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keycloak: null,
      authenticated: null,
      token: null
    };

    if (this.props.token) {
      this.state.token = this.props.token;
    }
  }

  componentDidMount() {
    const keycloak = Keycloak({
      url : "https://dev.keycloak.mozocoin.io/auth",
      realm: "mozo",
      clientId: "desktop_app"
    });
    keycloak.init({
      onLoad: "check-sso",
      responseMode: "query"
    }).then(authenticated => {
      if (authenticated) {
        this.setState({
          keycloak: keycloak,
          authenticated: authenticated
        });
      }
    });
    keycloak.login({
      redirectUri : "http://127.0.0.1:33013/oauth2-getcode",
      scope: "offline_access"
    });
  }

  render() {
    if (this.state.keycloak) {
      if (this.state.authenticated) return (
          <div>
          <p>This is a Keycloak-secured component of your application. You shouldn't be able
          to see this unless you've authenticated with Keycloak.</p>
          </div>
      );
    }
    return (
        <div>Loading Login screen...</div>
    );
  }
}
