import React from "react";
import { Mutation } from "react-apollo";
import { UPDATE_USER_QUERY } from "../../queries";

import "./Profile.css";

export default class Profile extends React.Component {
  state = {};

  render() {
    let firstNameRef, lastNameRef, emailRef;
    return (
      <div id="Profile">
        <h2>My Profile</h2>
        <Mutation mutation={UPDATE_USER_QUERY}>
          {(updateUser, { data }) => (
            <form
              onSubmit={e => {
                e.preventDefault();
                const submitObj = {
                  variables: {
                    id: this.props.user.id,
                    first_name: firstNameRef.value,
                    last_name: lastNameRef.value,
                    email: emailRef.value
                  }
                };
                console.log("submitObj:", submitObj);
                updateUser(submitObj);
              }}
            >
              <div className="form-group">
                <label htmlFor="first_name">First Name:</label>
                <input
                  id="first_name"
                  defaultValue={this.props.user.first_name}
                  ref={node => {
                    firstNameRef = node;
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name:</label>
                <input
                  id="last_name"
                  defaultValue={this.props.user.last_name}
                  ref={node => {
                    lastNameRef = node;
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  defaultValue={this.props.user.email}
                  ref={node => {
                    emailRef = node;
                  }}
                />
              </div>
              <button type="submit">Submit Changes</button>
            </form>
          )}
        </Mutation>
      </div>
    );
  }
}
