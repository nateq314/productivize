// @flow

import React from "react";
import { Mutation } from "react-apollo";
import { UPDATE_TODO_QUERY } from "../../queries";
import { type Todo } from "../TodoList/TodoList";

import "./TodoListItemContent.css";

type TodoListItemContentProps = {
  beginEdit: () => void,
  endEdit: () => void,
  isEditing: boolean,
  todo: Todo
};

type TodoListItemContentState = {
  content: string
};

type UpdateTodoArgs = {
  variables: {|
    id: number,
    content: string
  |}
};

function focusCaret(input: HTMLInputElement) {
  input.selectionStart = input.selectionEnd = input.value.length;
}

function prettyDate(date: Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return (
    daysOfTheWeek[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
  );
}

export default class TodoListItemContent extends React.Component<TodoListItemContentProps, TodoListItemContentState> {
  inputRef: HTMLInputElement;
  contentWidthCalculatorRef: HTMLSpanElement;
  state = {
    content: this.props.todo.content
  };

  componentDidUpdate(prevProps: TodoListItemContentProps) {
    if (prevProps.todo !== this.props.todo) {
      this.setState({ content: this.props.todo.content }, () => {
        // because width depends on a previous rendering
        // This will set it properly when the content is changed externally
        // (from the details pane or from an incoming change via subscription)
        this.forceUpdate();
      });
    }
  }

  componentDidMount() {
    // because width depends on a previous rendering
    this.forceUpdate();
  }

  render() {
    const { todo, isEditing } = this.props;
    const completedOn = todo.completedOn ? new Date(todo.completedOn) : null;

    return (
      <div
        className={`TodoListItemContent ${todo.completedOn ? "completed" : ""} ${todo.important ? "important" : ""}`}
      >
        <Mutation mutation={UPDATE_TODO_QUERY}>
          {(updateTodo, { data }) => (
            <form
              className={`edit-todo ${isEditing ? "isEditing" : ""}`}
              onSubmit={this.onSubmit.bind(this, updateTodo)}
            >
              <div className="contentWidthCalculator">
                <span
                  className="content"
                  ref={node => {
                    if (node) this.contentWidthCalculatorRef = node;
                  }}
                >
                  {this.state.content}
                </span>
              </div>
              <input
                readOnly={isEditing ? false : true}
                value={this.state.content}
                ref={node => {
                  if (node) this.inputRef = node;
                }}
                onBlur={this.reset}
                onChange={this.onChange}
                onClick={this.onClick}
                onDoubleClick={this.onDoubleClick}
                onKeyDown={this.onKeyDown}
                style={{
                  width: this.contentWidthCalculatorRef ? this.contentWidthCalculatorRef.offsetWidth + 10 + "px" : null
                }}
              />
            </form>
          )}
        </Mutation>
        {completedOn && <div className="todo-completedOn">Completed on {prettyDate(completedOn)}</div>}
      </div>
    );
  }

  reset = () => {
    if (this.props.isEditing) {
      this.setState({
        content: this.props.todo.content
      });
      this.props.endEdit();
    }
  };

  onChange = () => {
    this.setState(
      {
        content: this.inputRef.value
      },
      () => {
        this.forceUpdate(); // to update the input width
      }
    );
  };

  onClick = (e: SyntheticEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  onDoubleClick = () => {
    if (!this.props.todo.completedOn && !this.props.isEditing) {
      focusCaret(this.inputRef);
      this.props.beginEdit();
    }
  };

  onKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (this.props.isEditing) {
      e.nativeEvent.stopImmediatePropagation();
    }
    if (e.keyCode === 27) {
      this.reset();
    }
  };

  onSubmit(updateTodo: UpdateTodoArgs => void, e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    updateTodo({ variables: { id: this.props.todo.id, content: this.state.content } });
    this.props.endEdit();
  }
}
