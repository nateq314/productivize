import React from "react";
import TodoListItem from "../TodoListItem/TodoListItem";
import { List } from "immutable";
import TodoInput from "../TodoInput/TodoInput";
import TodoFilter, { FILTER_ALL, FILTER_UNCOMPLETED, FILTER_COMPLETED } from "../TodoFilter/TodoFilter";
import ContextMenu from "../ContextMenu/ContextMenu";

import "./TodoList.css";

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: null,
      filter: FILTER_UNCOMPLETED,
      contextMenu: null, // an integer
      contextMenuLocation: null
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
                  toggleContextMenu={this.toggleContextMenu.bind(this)}
                />
              ))
          ) : (
            <h3 id="no-todos">No to-dos to display. Get started by entering one in the above input.</h3>
          )}
        </ul>
        {this.state.contextMenu && <ContextMenu location={this.state.contextMenuLocation} />}
      </div>
    );
  }

  setEditingStatus(todoID) {
    this.setState({
      isEditing: todoID
    });
  }

  clearEditingStatus() {
    this.setState({
      isEditing: null
    });
  }

  filterOnChange(filter) {
    this.setState({ filter });
  }

  toggleContextMenu(e, todoID) {
    e.preventDefault();
    this.setState({
      contextMenu: this.state.contextMenu === todoID ? null : todoID,
      contextMenuLocation: {
        x: e.clientX,
        y: e.clientY
      }
    });
  }
}

export default TodoList;
