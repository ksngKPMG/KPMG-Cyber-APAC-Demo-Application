import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter, Redirect} from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security, SecureRoute } from '@okta/okta-react';
import Home from './Home';
import Profile from './Profile';
import Register from './Register';
import AWS from "aws-sdk"
import axios from 'axios';
import configData from './config/config.json'


<<<<<<< HEAD
const oktaAuth = new OktaAuth({
  issuer: configData.APP_ISSUER,
  clientId: configData.CLIENTID,
  redirectUri: window.location.origin + '/login/callback'
});
=======
var APP_ISSUER="";
var CLIENTID="";
var oktaAuth = null;
>>>>>>> 53b378f569e75dfaabc54999b0d83d71532c3501

class App extends Component {
  state = {
    isLoading: true
  }
  async componentDidMount() {
    try {
      const response = await fetch('http://localhost:3000/profile', {
        headers: {
          Authorization: 'Bearer ' + this.props.authState.accessToken
        }
      });
      const data = await response.json();
      //console.log("Mounted"+data);
      this.setState({ messages: data.messages });
    } catch (err) {
      // handle error as needed
      console.log("Into the error message: "+ err)
    }
  }

  async fetch(){
    AWS.config.update({
      accessKeyId: configData.ACCESSKEYID,
      secretAccessKey: configData.SECRETACCESSKEY,
      region: configData.REGION
    })
    const s3 = new AWS.S3();
    const params = {
      Bucket: configData.BUCKET,
      Key: configData.KEY,
      Expires : 3600
    }

    const url = s3.getSignedUrl('getObject',params);
    await axios.get(url)
    .then(response => {
      APP_ISSUER=response.data.APP_ISSUER;
      CLIENTID=response.data.CLIENTID;
      oktaAuth = new OktaAuth({
        issuer: APP_ISSUER,
        clientId: CLIENTID,
        redirectUri: window.location.origin + '/login/callback'
      });
      //console.log("In FetchFunction"+this.state.isLoading)
      if(this.state.isLoading==true){
        this.setState({isLoading:false})
      }
    })
  }

  constructor(props) {
    super(props);
    this.fetch();
    this.restoreOriginalUri = async (_oktaAuth, originalUri) => {
        props.history.replace(toRelativeUrl(originalUri || '/', window.location.origin));};
  }
    
    //this.customAuthHandler = this.customAuthHandler.bind(this);
  
  customAuthHandler = async () =>{
    alert("You are not authenticated!");
    const {history} = this.props;
    history.push('/');
  }
<<<<<<< HEAD
  customAuthHandler = async () =>{
    alert("You are not authenticated!");
    const {history} = this.props;
    history.push('/');
  }

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
            oktaAuth.signInWithRedirect(); 
          }else{
            return <LoginCallback {...props}/>
          }
          return <Home />
          }
        }/>
        <SecureRoute path="/profile" component={Profile}/>
      </Security>
    );
=======
//onAuthRequired={this.customAuthHandler} component={LoginCallback}
  //render={ (props) => <LoginCallback {...props} onAuthResume={ this.onAuthResume } /> }
  
  render() {
    if(this.state.isLoading==true){
      return "Loading...";
    }else{
      console.log("Rendering...")
      return (
        <Security oktaAuth={oktaAuth} restoreOriginalUri={this.restoreOriginalUri} onAuthRequired={this.customAuthHandler}>
          <Route path="/" exact={true} component={Home} />
          <Route path="/register" exact={true} component={Register}/>
          <Route path="/login/callback"  render= { (props) => {
           // console.log(JSON.stringify( props.history.location) );
            const error = new URLSearchParams(props.history.location.search).get("error");
            console.log("Print: "+error);
            if(error!=null){
              alert("Access denied please log in again");
              oktaAuth.signInWithRedirect();
            }
            return <LoginCallback {...props}/> }
          }/>
          <SecureRoute path="/profile" component={Profile}/>
        </Security>
      );
    } 
>>>>>>> 53b378f569e75dfaabc54999b0d83d71532c3501
  }
}

const AppWithRouterAccess = withRouter(App);

class RouterApp extends Component {
  render() {
    return (<Router><AppWithRouterAccess/></Router>);
  }
}

export default RouterApp;
