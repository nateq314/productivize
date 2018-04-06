// @flow
import React from "react";
import TodoListItem from "../TodoListItem/TodoListItem";
import { List } from "immutable";
import TodoInput from "../TodoInput/TodoInput";
import TodoFilter, { FILTER_ALL, FILTER_UNCOMPLETED, FILTER_COMPLETED } from "../TodoFilter/TodoFilter";
import ContextMenu from "../ContextMenu/ContextMenu";

import "./TodoList.css";

export type Todo = {
  id: number,
  content: string,
  completedOn: number,
  important: boolean,
  created_at: number,
  updated_at: number
};

type TodoListProps = {
  contextMenu: any,
  setContextMenu: (e: SyntheticEvent<HTMLLIElement>, todoID: number) => void,
  todos: any,
  user: any,
  subscribeToTodoUpdates: () => void
};

type TodoListState = {
  isEditing: ?number,
  filter: number,
  contextMenu: any
};

class TodoList extends React.Component<TodoListProps, TodoListState> {
  constructor(props: TodoListProps) {
    super(props);
    this.state = {
      isEditing: null,
      filter: FILTER_UNCOMPLETED,
      contextMenu: null // an integer - the todo id
    };
  }

  componentDidMount() {
    this.props.subscribeToTodoUpdates();
  }

  render() {
    const filteredTodos = this.props.todos.filter(todo => {
      switch (this.state.filter) {
        case FILTER_UNCOMPLETED:
          return !todo.completedOn;
        case FILTER_COMPLETED:
          return todo.completedOn;
        case FILTER_ALL:
          return true;
        default:
          return false;
      }
    });
    return (
      <div id="TodoList">
        <div id="subheader">
          <TodoInput user={this.props.user} />
          <TodoFilter filter={this.state.filter} onChange={this.filterOnChange.bind(this)} />
        </div>
        <ul>
          {filteredTodos.length > 0 ? (
            List(filteredTodos)
              .sort((a, b) => (a.id < b.id ? -1 : 1))
              .map((todo, idx) => (
                <TodoListItem
                  key={todo.id}
                  todo={todo}
                  idx={idx}
                  isEditing={this.state.isEditing}
                  beginEdit={this.setEditingStatus.bind(this, todo.id)}
                  endEdit={this.clearEditingStatus.bind(this)}
                  setContextMenu={this.props.setContextMenu}
                />
              ))
          ) : (
            <h3 id="no-todos">No to-dos to display. Get started by entering one in the above input.</h3>
          )}
        </ul>
        {this.props.contextMenu && <ContextMenu {...this.props.contextMenu} />}
      </div>
    );
  }

  setEditingStatus(todoID: number) {
    this.setState({
      isEditing: todoID
    });
  }

  clearEditingStatus() {
    this.setState({
      isEditing: null
    });
  }

  filterOnChange(filter: number) {
    this.setState({ filter });
  }
}

export default TodoList;
