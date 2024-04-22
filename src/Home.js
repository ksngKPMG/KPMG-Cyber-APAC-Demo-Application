import React, { Component } from 'react';
import { withOktaAuth } from '@okta/okta-react';
import './App.css';
import { Link } from "react-router-dom";
import kpmgLogo from "./assets/KPMG_logo.png";
import truuthLogo from "./assets/truuth_logo.svg";

export default withOktaAuth(class Home extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.userData = props.userData;
  }

  async login() {
    await this.props.oktaAuth.signInWithRedirect();
  }

  async logout() {
    await this.props.oktaAuth.signOut();
  }

  logAuthState() {
    console.log(this.props.authState);
  }

  render() {
    let authButton = null;
    let pageTitle = null;
    if (this.props.authState?.isAuthenticated) {
      authButton = (
          <a className="button" onClick={this.logout}>Logout</a>
      );
      pageTitle = (
        <>
        <h1 className="page-title">Welcome, { this.props.authState.idToken.claims.name }</h1>
        <Link className="profile-btn" to={"/profile"}>View Profile</Link>
        </>
      );
    } else {
      authButton = (
          <a className="button" onClick={this.login}>Login</a>
      );
      pageTitle = (
        <>
          <h1 className="page-title">KPMG Truuth POC</h1>
          <p className="page-subtitle">Authenticate using Truuth Biopass or register a new user with Truuth KYC</p>
        </>
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          <img className="kpmg-logo" src={kpmgLogo} alt="kpmg logo"/>
          <img className="truuth-logo" src={truuthLogo} alt="truuth logo"/>
          {/*<img className="truuth-logo" src={truuthLogo} alt="truuth logo"/>*/}
          <div className="auth-window">
            { pageTitle }
            <div className="buttons">
              {authButton}
              <p className="btn-break">or</p>
              <Link className="button" to={'register'}>Register</Link>
            </div>
          </div>
          
        </header>
      </div>
    );
  }
});
