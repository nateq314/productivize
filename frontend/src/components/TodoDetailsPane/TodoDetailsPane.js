// @flow

import React from "react";
import type { Todo } from "../TodoList/TodoList";
import { Mutation } from "react-apollo";
import { UPDATE_TODO_QUERY } from "../../queries";

import "./TodoDetailsPane.css";

type TodoDetailsPaneProps = {
  // clearSelectedTodo: () => void,
  todo: ?Todo
};

type TodoDetailsPaneState = {
  content: ?string,
  contentIsEditing: boolean,
  description: ?string,
  descriptionIsEditing: boolean
};

export default class TodoDetilsPane extends React.Component<TodoDetailsPaneProps, TodoDetailsPaneState> {
  state = {
    content: this.props.todo && this.props.todo.content,
    contentIsEditing: false,
    description: this.props.todo && this.props.todo.description,
    descriptionIsEditing: false
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
    // const { todo } = this.props;
    return (
      <Mutation mutation={UPDATE_TODO_QUERY}>
        {(updateTodo, { data }) => (
          <div id="TodoDetailsPane">
            <div id="detailsContainer">
              <div className={`content ${this.state.contentIsEditing ? "editing" : ""}`}>
                <textarea
                  readOnly={!this.state.contentIsEditing}
                  value={this.state.content || ""}
                  onBlur={this.onBlur("content")}
                  onChange={this.onChange("content")}
                  onClick={this.onClick("content")}
                  onKeyDown={this.onKeyDown("content", updateTodo, false)}
                />
              </div>
              <div className={`description ${this.state.descriptionIsEditing ? "editing" : ""}`}>
                <label>DESCRIPTION</label>
                <span className={`smallprint`}>(Ctrl+Enter to submit)</span>
                <textarea
                  className={this.state.descriptionIsEditing ? "editing" : ""}
                  readOnly={!this.state.descriptionIsEditing}
                  value={this.state.description || ""}
                  onBlur={this.onBlur("description")}
                  onChange={this.onChange("description")}
                  onClick={this.onClick("description")}
                  onKeyDown={this.onKeyDown("description", updateTodo)}
                  placeholder="(Enter to-do description here)"
                />
              </div>
            </div>
          </div>
        )}
      </Mutation>
    );
  }

  onBlur = (name: string) => () => {
    if (this.props.todo) {
      this.setState({
        [name]: this.props.todo[name],
        [name + "IsEditing"]: false
      });
    }
  };

  onChange = (name: string) => (e: SyntheticKeyboardEvent<HTMLTextAreaElement>) => {
    this.setState({
      [name]: e.currentTarget.value
    });
  };

  onClick = (name: string) => (e: SyntheticMouseEvent<HTMLTextAreaElement>) => {
    this.setState({
      [name + "IsEditing"]: true
    });
  };

  onKeyDown = (name: string, updateTodo: any, allowNewline: boolean = true) => (
    e: SyntheticKeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (this.state[name + "IsEditing"]) {
      e.nativeEvent.stopImmediatePropagation();
    }
    if (this.props.todo) {
      if (e.keyCode === 13) {
        if (e.altKey || e.metaKey || !allowNewline) {
          updateTodo({
            variables: {
              id: this.props.todo.id,
              [name]: this.state[name]
            }
          });
          this.setState({
            [name + "IsEditing"]: false
          });
          e.preventDefault();
        } else {
          if (!allowNewline) {
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
        }
      } else if (e.keyCode === 27) {
        this.setState({
          [name]: this.props.todo[name],
          [name + "IsEditing"]: false
        });
      }
    }
  };
}
