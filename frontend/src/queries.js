import gql from "graphql-tag";

export const FETCH_TODOS_QUERY = gql`
  query fetchTodos($user_id: Int!) {
    todos(user_id: $user_id) {
      id
      content
      important
      completedOn
      created_at
      updated_at
    }
  }
`;

export const CREATE_TODO_QUERY = gql`
  mutation createTodo($user_id: Int!, $content: String!) {
    createTodo(user_id: $user_id, content: $content) {
      id
      content
      important
      completedOn
      created_at
      updated_at
    }
  }
`;

export const DELETE_TODO_QUERY = gql`
  mutation deleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      id
      content
      important
      completedOn
      created_at
      updated_at
    }
  }
`;

export const UPDATE_TODO_QUERY = gql`
  mutation updateTodo($id: Int!, $content: String, $important: Boolean, $completedOn: Date) {
    updateTodo(id: $id, content: $content, important: $important, completedOn: $completedOn) {
      id
      content
      important
      completedOn
      created_at
      updated_at
    }
  }
`;

export const UPDATE_TODOS_SUBSCRIPTION = gql`
  subscription todosUpdate($user_id: Int!) {
    todosUpdate(user_id: $user_id) {
      todoAdded {
        id
        content
        important
        completedOn
        created_at
        updated_at
      }
      todoUpdated {
        id
        content
        important
        completedOn
        created_at
        updated_at
      }
      todoDeleted {
        id
      }
    }
  }
`;
