import React, { useState, useEffect } from 'react';
//import { withOktaAuth } from '@okta/okta-react';
import { Link } from "react-router-dom";
import './App.css';
import {Helmet,HelmetProvider} from 'react-helmet-async';
import axios from 'axios';
import kpmgLogo from "./assets/KPMG_logo.png";
 
const KYCComponent = () => {
    const [config2,setConfig2] = useState({familyName:"",givenName:"", email:"", message:"",visibility:true});
    const [errors, setErrors] = useState({ givenName: "", email: "" });
    const [config, setConfig] = useState({
        tenant: "kpmgtest",
        token: "eyJraWQiOiIzTTZ6SWRRVjBRSTRaa3k2RGRuUWJRejhzcGd2QzZBenY3T3pXYSs1cDhrPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2MzcwZTlmNS05NjFlLTQwYjUtYWUzYy1jNDcxMzFhNGFlYzEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTJfenY2QlZLZ0JpIiwiY2xpZW50X2lkIjoiMzBucWt2MmVxN2duMmZqdDE0ZTE2amgzc2wiLCJvcmlnaW5fanRpIjoiMjZhN2E3NDYtMWYzOS00MDgwLWE3OTItNDI5M2MxOTk4NWVjIiwiZXZlbnRfaWQiOiI0Mjk2NGVkMy1mMmU2LTRhNGMtYjZlNS1mMWY3OTYxY2EwNDUiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzA4MDU4OTIwLCJleHAiOjE3MDgwNjI1MTksImlhdCI6MTcwODA1ODkyMCwianRpIjoiMjRiMGQwYjEtMWFjNS00YTJmLTlmZjgtMzk4ODM3YzUxOGUxIiwidXNlcm5hbWUiOiI2MzcwZTlmNS05NjFlLTQwYjUtYWUzYy1jNDcxMzFhNGFlYzEifQ.Adhhk80NkZmUQoTD85UK9uqysxL6wKyTTGGo2jnv-pXPOH8Ki-fjWO_Gais-QoqRHX5uckn8rw5meQg55F87koJ3XBeEV6YrAqMeuvsm7DyIFeHaQuSThhq_f93uNB0xHK1sdc_5D2OBp04Eii3dSB_EEIF7C66MRuLAG4tfro32lSamL1gO9IdJpyLiglgKermQXD1DveP0eQA-dw8NYWtQ3YBP7ZkW4biNGd-3rM2ysfnH3PMSNwdCunZ2FooWST5suvRTBS5Ju93A-CQx_qZDIO2CMwa-pU5I037tbQx0t4swFUQCiNXla5RUUMzyr4aJ-thtFI5Z4KEiYb3BqA",
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
      if (config2.givenName != "" && config2.email != "") {
        const truuthKYCWebSdk = document.getElementById("kycComponent");
        console.log("Into the init function" + config.token)
        if (truuthKYCWebSdk && truuthKYCWebSdk.init) {
          truuthKYCWebSdk.init(config);
          console.info("Truuth KYC Web SDK is initialized.");
        } else {
          console.error("Truuth KYC Web SDK not yet initialized.");
        }
      } else {
        if (!config2.givenName && !config2.email) { 
          setErrors({ givenName: "First name is required!", email: "Email is required!" })
        } else if (!config2.givenName) { 
          setErrors({ ...errors, givenName: "First name is required!" })
        } else if (!config2.email) {
          setErrors({ ...errors, email: "Email is required!" })
        }
      }
    };
 
    useEffect(()=>{
      const fetchData = async () =>{
        const requestData = {
          'grant_type' : 'client_credentials',
          'client_id' : '1iua3n3ifn3o1du2cm2ad4u0rt',
          'scope' : 'websdk/websdk:run'
        }
        const requestHeaders = {
          'Content-Type': "application/x-www-form-urlencoded",
          'Authorization': "Basic MWl1YTNuM2lmbjNvMWR1MmNtMmFkNHUwcnQ6MTFqMTIxanZsaTZrY2NsZWVqN3IwNDd2ZXMyM2YxYXYzbTgwNDc0c25kNThyOXU0ZDF2"
        }
        axios.post("https://kpmgtest-prod.auth.ap-southeast-2.amazoncognito.com/oauth2/token",requestData,{headers:requestHeaders})
        .then(response => {
          //console.log(response.data.access_token);
          setConfig(config=>({...config,token:response.data.access_token}));
         //console.log("Token variable is set as: " + config.token);
        })
        .catch(error => console.error("API Error:"+error))
 
      }
      fetchData();
    },[]);
   
    const handleChange = (event) => {
        setConfig2({...config2, [event.target.name]:event.target.value});//for display in alert window only
        setConfig({...config,config:{...config.config, [event.target.name]:event.target.value}});
       
    };
 
    const handleSubmit = (event) => {
        event.preventDefault();

        if (config2.givenName != "" && config2.email != "") {
          alert("Given Name:"+ config2.givenName + ",Family Name:"+ config2.familyName + ",Email:"+config2.email+",Message:"+ config2.message);
          setConfig2({...config2,visibility:false});
          console.info("Visibility"+config2.visibility);
        } else {
          if (!config2.givenName) setErrors({ ...errors, givenName: "Given name is required!" })
          if (!config2.email) setErrors({ ...errors, email: "Email is required!" })
        }
        
    }
 
    const onEventHandler = (event) => {
      event.preventDefault();
      console.log(event);
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
      <HelmetProvider>
      <div >
        <Helmet>
        <script type="module" src="https://cdn.truuth.id/kyc/websdk/1.0/truuth-kyc-websdk.js" />
        </Helmet>
        <truuth-kyc id="kycComponent" onClick={onEventHandler} onEvent={onEventHandler}></truuth-kyc>
        {config2.visibility &&
        <div id="register_page" className="App">
        <header className="App-header">
          <img className="kpmg-logo" src={kpmgLogo} alt="kpmg logo"/>
          <div className="register-page">
            <Link className="back-btn" to={"/"}>Back to home</Link>
            <h1 className="register-title">Register New User</h1>
              <form className="register-form" onSubmit={handleSubmit}>

                  <div className='register-input-field'>
                    <label className="register-label" htmlFor="firstname">First Name:</label>
                    <input style={ errors.givenName != "" ? { borderColor: 'red' } : { borderColor: 'black' } } className="register-input" type="text" id="firstname" name="givenName" value={config.givenName} onChange={handleChange} />
                    { errors.givenName != "" ? <p className='error-msg'>{errors.givenName}</p> : <></> }
                  </div>
                  
                  <div className='register-input-field'>
                    <label className="register-label" htmlFor="familyname">Family Name:</label>
                    <input className="register-input" type="text" id="familyname" name="familyName" value={config.familyName} onChange={handleChange} />
                  </div>
                  
                  <div className='register-input-field'>
                    <label className="register-label" htmlFor="email">Email:</label>
                    <input  style={ errors.email != "" ? { borderColor: 'red' } : { borderColor: 'black' } } className="register-input" type="email" id="email" name="email" value={config.email} onChange={handleChange} />
                    { errors.email != "" ? <p className='error-msg'>{errors.email}</p> : <></> }
                  </div>
                  

                  <button className="submit-btn" type="submit" onClick={init} >Submit</button>
              </form>
          </div>
            
        </header>
    </div>}
    </div>
    </HelmetProvider>
    );
  };
 
export default KYCComponent;