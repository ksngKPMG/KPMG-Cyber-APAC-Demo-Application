import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security, SecureRoute } from '@okta/okta-react';
import Home from './Home';
import Profile from './Profile';
import Register from './Register';


const oktaAuth = new OktaAuth({
  //issuer: 'https://bugcrowd-oie-7dee-1.oktapreview.com/oauth2/default',
  issuer: 'https://trial-2882636.oktapreview.com/oauth2/default',
  //clientId: '0oa6qbyjgqMfEHx4I0x7',
  clientId: '0oadxlcjporwDJXgP1d7',
  redirectUri: window.location.origin + '/login/callback'
});

class App extends Component {

  async componentDidMount() {
    try {
      const response = await fetch('http://localhost:3000/profile', {
        headers: {
          Authorization: 'Bearer ' + this.props.authState.accessToken
        }
      });
      const data = await response.json();
      console.log("Mounted"+data);
      this.setState({ messages: data.messages });
    } catch (err) {
      // handle error as needed
      console.log("Into the error message")
    }
  }

  constructor(props) {
    super(props);
    this.restoreOriginalUri = async (_oktaAuth, originalUri) => {
      props.history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
    };
  }

  render() {
    return (
      <Security oktaAuth={oktaAuth} restoreOriginalUri={this.restoreOriginalUri}>
        <Route path="/" exact={true} component={Home} />
        <Route path="/register" exact={true} component={Register}/>
        <Route path="/login/callback" component={LoginCallback}/>
        <SecureRoute path="/profile" component={Profile}/>
      </Security>
    );
  }
}

const AppWithRouterAccess = withRouter(App);

class RouterApp extends Component {
  render() {
    return (<Router><AppWithRouterAccess/></Router>);
  }
}

export default RouterApp;
