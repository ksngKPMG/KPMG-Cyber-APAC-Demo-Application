import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter, Redirect} from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security, SecureRoute } from '@okta/okta-react';
import Home from './Home';
import Profile from './Profile';
import Register from './Register';
import configData from './config/config.json'


const oktaAuth = new OktaAuth({
  issuer: configData.APP_ISSUER,
  clientId: configData.CLIENTID,
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
    //this.customAuthHandler = this.customAuthHandler.bind(this);
  }
  // customAuthHandler = async () =>{
  //   alert("You are not authenticated!");
  //   const {history} = this.props;
  //   history.push('/');
  // }
//onAuthRequired={this.customAuthHandler} component={LoginCallback}
  //render={ (props) => <LoginCallback {...props} onAuthResume={ this.onAuthResume } /> }
  render() {
    return (
      <Security oktaAuth={oktaAuth} restoreOriginalUri={this.restoreOriginalUri} onAuthRequired={this.customAuthHandler}>
        <Route path="/" exact={true} component={Home} />
        <Route path="/register" exact={true} component={Register}/>
        <Route path="/login/callback"  render= { (props) => {
          console.log(JSON.stringify( props.history.location) );
          const error = new URLSearchParams(props.history.location.search).get("error");
          console.log("Print: "+error);
          if(error!=null){
            alert("Access denied please log in again");
            return <Redirect to="/"/>
          }
          return <LoginCallback {...props}/> }
        }/>
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
