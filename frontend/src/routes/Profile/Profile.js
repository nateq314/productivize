// @flow

import React from "react";
import { Mutation } from "react-apollo";
import { UPDATE_USER_QUERY } from "../../queries";
import { type User } from "../../App";

import "./Profile.css";

type ProfileProps = {
  user: User
};

export default class Profile extends React.Component<ProfileProps> {
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
                if (firstNameRef && lastNameRef && emailRef) {
                  updateUser({
                    variables: {
                      id: this.props.user.id,
                      first_name: firstNameRef.value,
                      last_name: lastNameRef.value,
                      email: emailRef.value
                    }
                  });
                }
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
