// @flow

import React from "react";
import type { Todo } from "../TodoList/TodoList";
import { Mutation } from "react-apollo";
import { UPDATE_TODO_QUERY } from "../../queries";
import DatePicker from "react-date-picker/dist/entry.nostyle";

import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

import "./TodoDetailsPane.css";

type TodoDetailsPaneProps = {
  todo: ?Todo
};

type TodoDetailsPaneState = {
  content: ?string,
  contentIsEditing: boolean,
  description: ?string,
  descriptionIsEditing: boolean,
  mouseIsOver: boolean
};

export default class TodoDetilsPane extends React.Component<TodoDetailsPaneProps, TodoDetailsPaneState> {
  state = {
    content: this.props.todo && this.props.todo.content,
    contentIsEditing: false,
    description: this.props.todo && this.props.todo.description,
    descriptionIsEditing: false,
    mouseIsOver: false
  };
  inputObserver$: Subject;

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
    return (
      <Mutation mutation={UPDATE_TODO_QUERY}>
        {(updateTodo, { data }) => {
          if (!this.inputObserver$) {
            this.inputObserver$ = new Subject();
            this.inputObserver$.pipe(debounceTime(500)).subscribe(description => {
              if (this.props.todo) {
                updateTodo({
                  variables: {
                    id: this.props.todo.id,
                    description
                  }
                });
              }
            });
          }
          return (
            <div
              id="TodoDetailsPane"
              className={todo && todo.important ? "important" : ""}
              style={{
                transition: todo ? "0.4s right" : "0.25s right"
              }}
              onMouseOver={this.onMouseOver}
              onMouseOut={this.onMouseOut}
            >
              <div id="detailsContainer">
                <div className={`content ${this.state.contentIsEditing ? "editing" : ""}`}>
                  <textarea
                    readOnly={!this.state.contentIsEditing}
                    value={this.state.content || ""}
                    onBlur={this.onBlur("content")}
                    onChange={this.onChange("content")}
                    onClick={this.onClick("content")}
                    onKeyDown={this.onKeyDown("content", updateTodo, false)}
                    style={{
                      transition: this.state.mouseIsOver ? "0.5s background-color" : "none"
                    }}
                  />
                </div>
                <div className={`deadline`}>
                  {/* <input
                    className="deadline"
                    type="date"
                    onChange={e => {
                      console.log("ONCHANGE");
                      console.log(typeof e.currentTarget.value, e.currentTarget.value.length, e.currentTarget.value);
                      console.log(
                        new Date(
                          ...e.currentTarget.value.split("-").map((n, idx) => {
                            const int = parseInt(n, 10);
                            return idx === 1 ? int - 1 : int;
                          })
                        )
                      );
                    }}
                  /> */}
                  <DatePicker />
                </div>
                <div className={`description ${this.state.descriptionIsEditing ? "editing" : ""}`}>
                  <label>DESCRIPTION</label>
                  {/* <span className={`smallprint`}>(Ctrl+Enter to submit)</span> */}
                  <textarea
                    className={this.state.descriptionIsEditing ? "editing" : ""}
                    readOnly={!this.state.descriptionIsEditing}
                    value={this.state.description || ""}
                    onBlur={this.onBlur("description")}
                    onChange={(e: SyntheticKeyboardEvent<HTMLTextAreaElement>) => {
                      this.inputObserver$.next(e.currentTarget.value);
                      this.onChange("description")(e);
                    }}
                    onClick={this.onClick("description")}
                    onKeyDown={this.onKeyDown("description", updateTodo)}
                    placeholder="(Enter to-do description here)"
                    style={{
                      transition: this.state.mouseIsOver ? "0.5s background-color" : "none"
                    }}
                  />
                </div>
              </div>
            </div>
          );
        }}
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
          if (name === "content") {
            // only update on [Enter] for todo content. Todo description update is controlled by this.inputObserver$
            // (basically updates on keypress)
            updateTodo({
              variables: {
                id: this.props.todo.id,
                content: this.state.content
              }
            });
          }
          this.setState({
            [name + "IsEditing"]: false
          });
          e.preventDefault();
        }
      } else if (e.keyCode === 27) {
        if (name === "content") {
          this.setState({
            content: this.props.todo.content,
            contentIsEditing: false
          });
        } else {
          this.setState({
            descriptionIsEditing: false
          });
        }
      }
    }
  };

  onMouseOver = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    if (!this.state.mouseIsOver) {
      this.setState({
        mouseIsOver: true
      });
    }
  };

  onMouseOut = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    const relatedTarget: any = e.relatedTarget;
    if (
      !relatedTarget ||
      !relatedTarget.className ||
      relatedTarget.className === "todos" ||
      relatedTarget.id === "App"
    ) {
      this.setState({
        mouseIsOver: false
      });
    }
  };
}
