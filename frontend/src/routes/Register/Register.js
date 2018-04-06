// @flow

import React from "react";
import { Link } from "react-router-dom";

import "../../components/Login/Login.css";
import "./Register.css";

type RegisterProps = {
  onRegister: (string, string, string, string) => Promise<void>
};

let first_name, last_name, email, password;

export default ({ onRegister }: RegisterProps) => (
  <div id="Register">
    <form
      onSubmit={e => {
        e.preventDefault();
        if (first_name && last_name && email && password) {
          onRegister(first_name.value, last_name.value, email.value, password.value);
        }
      }}
    >
      <div className="form-group">
        <input
          id="first_name"
          ref={node => {
            first_name = node;
          }}
          placeholder="First Name"
          defaultValue=""
        />
      </div>
      <div className="form-group">
        <input
          id="last_name"
          ref={node => {
            last_name = node;
          }}
          placeholder="Last Name"
          defaultValue=""
        />
      </div>
      <div className="form-group">
        <input
          id="email"
          ref={node => {
            email = node;
          }}
          placeholder="Email address"
          defaultValue=""
        />
      </div>
      <div className="form-group">
        <input
          id="password"
          type="password"
          ref={node => {
            password = node;
          }}
          placeholder="Password"
          defaultValue=""
        />
      </div>
      <button type="submit">Register</button>
      <div className="linkContainer">
        <Link to="/" className="goBack">
          Go Back
        </Link>
      </div>
    </form>
  </div>
);
