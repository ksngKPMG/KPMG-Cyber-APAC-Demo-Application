import React, { Component, useState, useEffect } from 'react';
import { withOktaAuth } from '@okta/okta-react';
import { Link } from "react-router-dom";
import './App.css';
import {Helmet} from 'react-helmet';

const KYCComponent = () => {
    const [config2,setConfig2] = useState({familyName:"",givenName:"", email:"", message:"",visibility:true});
    const [config, setConfig] = useState({
        tenant: "kpmgtest",
        token: "eyJraWQiOiIzTTZ6SWRRVjBRSTRaa3k2RGRuUWJRejhzcGd2QzZBenY3T3pXYSs1cDhrPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2MzcwZTlmNS05NjFlLTQwYjUtYWUzYy1jNDcxMzFhNGFlYzEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTJfenY2QlZLZ0JpIiwiY2xpZW50X2lkIjoiMzBucWt2MmVxN2duMmZqdDE0ZTE2amgzc2wiLCJvcmlnaW5fanRpIjoiMGVjNjJkYTQtMjhlYy00YmMwLTliMTctMjg3ZjZlYWQyMGU2IiwiZXZlbnRfaWQiOiI3ZGQwM2YzYy05YTcyLTRkNjItOWU1OC1kMGYwZTUxM2VkMjMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzA3Mjk0NTA5LCJleHAiOjE3MDcyOTgxMDksImlhdCI6MTcwNzI5NDUwOSwianRpIjoiM2NmNjZhNjAtNDQwYy00YzRkLWFiZjMtZDk5YjJlYWE1NzdhIiwidXNlcm5hbWUiOiI2MzcwZTlmNS05NjFlLTQwYjUtYWUzYy1jNDcxMzFhNGFlYzEifQ.Q1FgXnaRqTI3gm1LPOuxbW64pr_XCAt2dSY5r4aREN_oUBIURyeiT4Vw06P9Y7UWwkyaz7_no6fxI0VVQkt8rpi4QDLNzvTwoayiMDd7Tqp0a9snLKGUEZgZljwXlNT8Chkr44Z8z3hYdiogWWbb822JOf2PcwFFOnWlxlQD9B2ZYhv7qobWahu1YlVUk5KPfehq7YNYiepC1mTwgK8OZ52Ky6EE0gK77PV8zF8SNEHBpG_0wuJekGOJMKNagyyLx5jm8d2b5U5XofvjwniwR2TIoXd2EuXhETVhj8RQkvny0G2whKXWjaHE0-ernpY0Ej4wZu8x8XjfTDqLCsfiEQ",
        apiUrl: "https://portal.api.au.truuth.id/kyc/",
        width: "100%",
        height: "100%",
        config: {
          email: "1212@gmail.com",
          externalRefId: "viva max",
          givenName: "givenname",
          familyName: "familyname",
          mobileNumber: "091234567890",
          dateOfBirth: "1990-03-24",
          gender: "M",
          options: {
            channel: "web",
            timeout: 45,
            sanctionsAndPepCheckRequired: false,
            businessVerificationRequired: false,
            currentAddressProofingRequired: false,
          }
        }});
        
    const init = () => {
      const truuthKYCWebSdk = document.getElementById("kycComponent");
      if (truuthKYCWebSdk && truuthKYCWebSdk.init) {
        truuthKYCWebSdk.init(config);
        console.info("Truuth KYC Web SDK is initialized.");
      } else {
        console.error("Truuth KYC Web SDK not yet initialized.");
      }
    };

    const handleChange = (event) => {
        setConfig2({...config2, [event.target.name]:event.target.value});//for display in alert window only
        setConfig({...config,config:{...config.config, [event.target.name]:event.target.value}});
        
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert("Given Name:"+ config2.givenName + ",Family Name:"+ config2.familyName + ",Email:"+config2.email+",Message:"+ config2.message);
        setConfig2({...config2,visibility:false});
        console.info("Visibility"+config2.visibility);
    }

    const onEventHandler = (event) => {
      console.log(
        "Event Information -> type: " +
          event.detail.type +
          " tenant: " +
          event.detail.tenant +
          " verificationId: " +
          event.detail.verificationId +
          " timestamp: " +
          event.detail.timestamp +
          (event.detail.body
            ? " body: " + JSON.stringify(event.detail.body)
            : "")
      );
    };
  
    return (
      <div >
        <Helmet>
        <script type="module" src="https://cdn.truuth.id/kyc/websdk/1.0/truuth-kyc-websdk.js" />
        </Helmet>
        <truuth-kyc id="kycComponent" onevent={onEventHandler}></truuth-kyc>
        {config2.visibility &&
        <div id="register_page" className="App">
        <header className="App-header">
            <h1>Register New User</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="firstname">First Name:</label>
                <input type="text" id="firstname" name="givenName" value={config.givenName} onChange={handleChange} />

                <label htmlFor="familyname">Family Name:</label>
                <input type="text" id="familyname" name="familyName" value={config.familyName} onChange={handleChange} />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={config.email} onChange={handleChange} />

                <label htmlFor="message">Message:</label>
                <textarea id="message" name="message" value={config.message} onChange={handleChange} />

                <button className="submit-btn" type="submit" onClick={init} >Submit</button>
            </form>
            <Link className="back-btn" to={"/"}>Back</Link>
        </header>
    </div>}
    </div>
    );
  };

export default KYCComponent;
