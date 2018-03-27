import gql from "graphql-tag";

export const FETCH_TODOS_QUERY = gql`
  query {
    todos(user_id: 12) {
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
  mutation createTodo($content: String!) {
    createTodo(user_id: 12, content: $content) {
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