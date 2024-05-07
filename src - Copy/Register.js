import React, { useState, useEffect } from 'react';
//import { withOktaAuth } from '@okta/okta-react';
import { Link } from "react-router-dom";
import './App.css';
import {Helmet,HelmetProvider} from 'react-helmet-async';
import axios from 'axios';
import kpmgLogo from "./assets/KPMG_logo.png";
import configData from "./config/config.json"
import AWS from "aws-sdk"

const KYCComponent = () => {
    const [config2,setConfig2] = useState({familyName:"",givenName:"", email:"", message:"",visibility:true});
    const [errors, setErrors] = useState({ givenName: "", email: "" });
    const [config, setConfig] = useState({
        tenant: "",
        token: "",
        apiUrl: "",
        width: "100%",
        height: "100%",
        config: {
          email: "",
          externalRefId: "viva max",
<<<<<<< HEAD
          givenName: "givenname",
          familyName: "familyname",
=======
          givenName: "",
          familyName: "",
>>>>>>> 53b378f569e75dfaabc54999b0d83d71532c3501
          mobileNumber: "",
          dateOfBirth: "",
          gender: "",
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
        AWS.config.update({
          accessKeyId: configData.ACCESSKEYID,
          secretAccessKey: configData.SECRETACCESSKEY,
          region: configData.REGION
        })
        const s3 = new AWS.S3();
        const params = {
          Bucket: 'demoappkpmg',
          Key: 'config.json',
          Expires : 3600
        }
        var TOKEN_CLIENTID="";
        var BASICAUTH="";
        var TOKEN_URL="";
        const url = s3.getSignedUrl('getObject',params);
        await axios.get(url)
        .then(response => {
          //console.log("Axios call" +JSON.stringify(response.data) );
          //console.log(response.data.TOKEN_URL);
          TOKEN_CLIENTID=response.data.TOKEN_CLIENTID;
          BASICAUTH=response.data.BASICAUTH;
          TOKEN_URL=response.data.TOKEN_URL;
          setConfig(config=>({...config,tenant:response.data.TENANT,apiUrl:response.data.REGISTER_URI}));
        })

        const requestData = {
          'grant_type' : 'client_credentials',
          'client_id' : TOKEN_CLIENTID,
          'scope' : 'websdk/websdk:run'
        }
        const requestHeaders = {
          'Content-Type': "application/x-www-form-urlencoded",
          'Authorization': BASICAUTH
        }
        axios.post(TOKEN_URL,requestData,{headers:requestHeaders})
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
      //console.log(event);
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