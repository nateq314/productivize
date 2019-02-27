// @flow

import React from "react";
import { Link } from "react-router-dom";
import Logo from "../svgs/faCheckCircle.svg.js";

import "./Login.css";

type LoginProps = {
  onSubmit: (string, string) => Promise<void>
};

let email, password;

export default ({ onSubmit }: LoginProps) => (
  <div id="Login">
    <Logo className="logo" />
    <form
      onSubmit={(e) => {
        if (email && password) {
          e.preventDefault();
          onSubmit(email.value, password.value);
        }
      }}
    >
      <div className="form-group">
        <input
          id="email"
          ref={(node) => {
            email = node;
          }}
          placeholder="Email address"
          defaultValue=""
          autoFocus
        />
      </div>
      <div className="form-group">
        <input
          id="password"
          type="password"
          ref={(node) => {
            password = node;
          }}
          placeholder="Password"
          defaultValue=""
        />
      </div>
      <button type="submit" className="login">
        Log In
      </button>
      <div className="linkContainer">
        <Link to="/register" className="register">
          Register a New Account
        </Link>
      </div>
    </form>
  </div>
);
