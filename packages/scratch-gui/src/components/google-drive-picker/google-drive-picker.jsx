import React from 'react';
import PropTypes from 'prop-types';
import loadScript from 'load-script';

const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';
const GIS_URL = "https://accounts.google.com/gsi/client";

let scriptLoadingStarted = false;

class GoogleChooser extends React.Component {
  constructor(props) {
    super(props);
    this.onClientLoad = this.onClientLoad.bind(this);
    this.onApiLoad = this.onApiLoad.bind(this);
    this.onChoose = this.onChoose.bind(this);
  }

  componentDidMount() {
    if(this.isGoogleReady()) {
      // google api is already exists
      // init immediately
      this.onApiLoad();
    } else if (!scriptLoadingStarted) {
      // load google api and gsi then init
      scriptLoadingStarted = true;
      loadScript(GOOGLE_SDK_URL, this.onApiLoad);
    } else {
      // is loading
    }
  }

  isGoogleReady() {
    return !!window.gapi;
  }

  isGoogleAuthReady() {
    return !!google.accounts;
  }

  isGooglePickerReady() {
    return !!window.google.picker;
  }

  onClientLoad() {
    window.gapi.client.init({
        apiKey: this.props.developerKey,
    });
  }

  onApiLoad() {
    // now that Gapi is loaded, load auth
    loadScript(GIS_URL);

    window.gapi.load('client', this.onClientLoad);
    window.gapi.load('picker');
  }

  doAuth(callback) {
    const client = google.accounts.oauth2.initTokenClient({
        client_id: this.props.clientId,
        scope: this.props.scope,
        callback: callback,
    });

    client.requestAccessToken();
  }

  onChoose() {
    if (!this.isGoogleReady() || !this.isGoogleAuthReady() || !this.isGooglePickerReady() || this.props.disabled) {
        console.log("Some api is missing:", this.isGoogleReady(), this.isGoogleAuthReady(), this.isGooglePickerReady());
      return null;
    }

    const token = window.gapi.client.getToken();
    const oauthToken = token && token.access_token;

    if (oauthToken) {
      this.createPicker(oauthToken);
    } else {
      this.doAuth(response => {
        if (response.access_token) {
          this.createPicker(response.access_token)
        } else {
          this.props.onAuthFailed(response);
        }
      });
    }
  }

  createPicker(oauthToken) {

    this.props.onAuthenticate(oauthToken);

    if(this.props.createPicker){
      return this.props.createPicker(google, oauthToken)
    }

    const googleViewId = google.picker.ViewId[this.props.viewId];
    const view = new window.google.picker.View(googleViewId);

    if (this.props.mimeTypes) {
      view.setMimeTypes(this.props.mimeTypes.join(','))
    }
    if (this.props.query) {
      view.setQuery(this.props.query)
    }

    if (!view) {
      throw new Error('Can\'t find view by viewId');
    }

    const picker = new window.google.picker.PickerBuilder()
                             .addView(view)
                             .setOAuthToken(oauthToken)
                             .setDeveloperKey(this.props.developerKey)
                             .setCallback(this.props.onChange)
                             .setAppId(this.props.appId);

    if (this.props.origin) {
      picker.setOrigin(this.props.origin);
    }

    if (this.props.navHidden) {
      picker.enableFeature(window.google.picker.Feature.NAV_HIDDEN)
    }

    if (this.props.multiselect) {
      picker.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
    }

    picker.build()
          .setVisible(true);
  }

  render() {
    return (
      <div onClick={this.onChoose}>
        {
          this.props.children ?
            this.props.children :
            <button>Open google chooser</button>
        }
      </div>
    );
  }
}

GoogleChooser.propTypes = {
    appId: PropTypes.string.isRequired,
    children: PropTypes.node,
    clientId: PropTypes.string.isRequired,
    developerKey: PropTypes.string,
    scope: PropTypes.array,
    viewId: PropTypes.string,
    authImmediate: PropTypes.bool,
    origin: PropTypes.string,
    onChange: PropTypes.func,
    onAuthenticate: PropTypes.func,
    onAuthFailed: PropTypes.func,
    createPicker: PropTypes.func,
    multiselect: PropTypes.bool,
    navHidden: PropTypes.bool,
    disabled: PropTypes.bool
};

GoogleChooser.defaultProps = {
    onChange: () => {},
    onAuthenticate: () => {},
    onAuthFailed: () => {},
    scope:['https://www.googleapis.com/auth/drive.file'],
    viewId: 'DOCS',
    authImmediate: false,
    multiselect: false,
    navHidden: false,
    disabled: false
};

export default GoogleChooser;