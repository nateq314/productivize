// @flow

import React from "react";
import TodoListItem from "../TodoListItem/TodoListItem";
import { List } from "immutable";
import TodoInput from "../TodoInput/TodoInput";
import TodoFilter, { FILTER_ALL, FILTER_UNCOMPLETED, FILTER_COMPLETED } from "../TodoFilter/TodoFilter";
import ContextMenu from "../ContextMenu/ContextMenu";
import { type User, type ContextMenuObjType } from "../../App";
import TodoDetailsPane from "../TodoDetailsPane/TodoDetailsPane";

import "./TodoList.css";

export type Todo = {
  id: number,
  content: string,
  description: string,
  completedOn: number,
  important: boolean,
  created_at: number,
  updated_at: number
};

type TodoListProps = {
  contextMenu: ContextMenuObjType,
  setContextMenu: (SyntheticMouseEvent<HTMLLIElement>, number) => void,
  todos: Todo[],
  user: User,
  subscribeToTodoUpdates: () => void
};

type TodoListState = {
  isEditing: ?number,
  filter: number,
  selectedTodo: ?number,
  filteredTodos: Todo[]
};

function getFilteredTodos(todos: Todo[], filter: number): Todo[] {
  return todos.filter(todo => {
    switch (filter) {
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
}

class TodoList extends React.Component<TodoListProps, TodoListState> {
  constructor(props: TodoListProps) {
    super(props);
    this.state = {
      isEditing: null,
      filter: FILTER_UNCOMPLETED,
      selectedTodo: null,
      filteredTodos: getFilteredTodos(this.props.todos, FILTER_UNCOMPLETED)
    };
  }

  componentDidMount() {
    this.props.subscribeToTodoUpdates();
    document.addEventListener("keydown", this.documentOnKeydown.bind(this));
  }

  componentDidUpdate(prevProps: TodoListProps) {
    // console.log("TodoList componentDidUpdate()");
    if (prevProps.todos !== this.props.todos) {
      this.setState({
        filteredTodos: getFilteredTodos(this.props.todos, this.state.filter)
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.documentOnKeydown);
  }

  render() {
    const selectedTodo = this.state.selectedTodo
      ? this.props.todos.find(todo => todo.id === this.state.selectedTodo)
      : null;
    return (
      <div id="TodoList" className={this.state.selectedTodo ? "todoSelected" : null}>
        <div id="subheader">
          <TodoInput user={this.props.user} />
          <TodoFilter filter={this.state.filter} onChange={this.filterOnChange.bind(this)} />
        </div>
        <div id="todoListContainer">
          <ul className="todos">
            {this.state.filteredTodos.length > 0 ? (
              List(this.state.filteredTodos)
                .sort((a, b) => (a.id < b.id ? -1 : 1))
                .map((todo, idx) => (
                  <TodoListItem
                    key={todo.id}
                    todo={todo}
                    idx={idx}
                    isEditing={this.state.isEditing}
                    beginEdit={this.setEditingStatus.bind(this, todo.id)}
                    endEdit={this.setEditingStatus.bind(this, null)}
                    setContextMenu={this.props.setContextMenu}
                    setSelected={this.setSelectedTodo.bind(this, todo.id)}
                    isSelected={this.state.selectedTodo === todo.id}
                  />
                ))
            ) : (
              <h3 id="no-todos">No to-dos to display. Get started by entering one in the above input.</h3>
            )}
          </ul>
          {selectedTodo && <TodoDetailsPane todo={selectedTodo} />}
          {this.props.contextMenu && <ContextMenu {...this.props.contextMenu} />}
        </div>
      </div>
    );
  }

  setSelectedTodo(todo: number, e: any) {
    if (/(DIV|LI)/.test(e.target.nodeName)) {
      const { selectedTodo } = this.state;
      this.setState({
        selectedTodo: selectedTodo === todo ? null : todo
      });
    }
  }

  setEditingStatus(todoID: ?number) {
    this.setState({
      isEditing: todoID
    });
  }

  filterOnChange(filter: number) {
    const selectedTodo = this.state.selectedTodo
      ? this.props.todos.find(todo => todo.id === this.state.selectedTodo)
      : null;
    const newState: Object = {
      filter,
      filteredTodos: getFilteredTodos(this.props.todos, filter)
    };
    if (
      selectedTodo &&
      ((filter === FILTER_COMPLETED && !selectedTodo.completedOn) ||
        (filter === FILTER_UNCOMPLETED && selectedTodo.completedOn))
    ) {
      newState.selectedTodo = null;
    }
    this.setState(newState);
  }

  documentOnKeydown(e: KeyboardEvent) {
    if (e.keyCode === 27) {
      this.setState({
        selectedTodo: null
      });
    }
  }
}

export default TodoList;
