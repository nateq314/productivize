// @flow

import React from "react";
import type { Todo } from "../TodoList/TodoList";
import { Mutation } from "react-apollo";
import { UPDATE_TODO_QUERY } from "../../queries";

import "./TodoDetailsPane.css";

type TodoDetailsPaneProps = {
  todo: ?Todo
};

type TodoDetailsPaneState = {
  content: ?string,
  description: ?string
};

export default class TodoDetilsPane extends React.Component<TodoDetailsPaneProps, TodoDetailsPaneState> {
  state = {
    content: null,
    description: null
  };

  componentDidUpdate(prevProps: TodoDetailsPaneProps) {
    if (this.props.todo && prevProps.todo !== this.props.todo) {
      this.setState({
        content: this.props.todo.content,
        description: this.props.todo.description
      });
    }
  }

  render() {
    const { todo } = this.props;
    return todo ? (
      <Mutation mutation={UPDATE_TODO_QUERY}>
        {(updateTodo, { data }) => (
          <div id="TodoDetailsPane">
            <div id="detailsContainer">
              <form onSubmit={this.onSubmit}>
                <div className="content">
                  <textarea
                    value={this.state.content || ""}
                    onChange={this.onChange("content")}
                    onClick={this.onClick("content")}
                    onKeyDown={this.onKeyDown("content")}
                  />
                </div>
                <div className="description">
                  <label>Description</label>
                  <textarea
                    value={this.state.description || ""}
                    onChange={this.onChange("description")}
                    onClick={this.onClick("description")}
                    onKeyDown={this.onKeyDown("description")}
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </Mutation>
    ) : null;
  }

  onChange = (name: string) => (e: SyntheticKeyboardEvent<HTMLTextAreaElement>) => {
    this.setState({
      [name]: e.currentTarget.value
    });
  };

  onClick = (name: string) => (e: SyntheticMouseEvent<HTMLTextAreaElement>) => {
    // TODO: implement this
  };

  onKeyDown = (name: string) => (e: SyntheticKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13) {
      if (!e.altKey) {
        this.onSubmit();
        e.preventDefault();
      } else {
        const taElement = e.currentTarget;
        const idx = taElement.selectionStart;
        this.setState(
          {
            [name]: this.state[name].slice(0, idx) + "\r\n" + this.state[name].slice(idx)
          },
          () => {
            taElement.selectionStart = taElement.selectionEnd = idx + 1;
          }
        );
      }
    } else if (e.keyCode === 27) {
      if (this.props.todo) {
        // TODO: make this.props.todo a definite (not a maybe) type and get rid of this if block
        this.setState({
          [name]: this.props.todo[name]
        });
      }
    }
  };

  onSubmit(e: ?SyntheticEvent<HTMLFormElement>) {
    console.log("submitting...");
    if (e) e.preventDefault();
    // TODO: implement the rest of this
  }
}
