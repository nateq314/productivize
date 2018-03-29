import React from "react";

let email, password;

export default ({ onSubmit }) => (
  <div id="Login">
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(email.value, password.value);
      }}
    >
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
      <button type="submit">Log In</button>
    </form>
  </div>
);
