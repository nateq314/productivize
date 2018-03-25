import { makeExecutableSchema } from "graphql-tools";
import User from "./models/user";
import Todo from "./models/todo";

const typeDefs = `
	type User {
		id: Int!
		first_name: String
		last_name: String
		email: String
		todos: [Todo]
	}

	type Todo {
		id: Int!
		user: User
		content: String!
		important: Boolean!
	}

	type Query {
		users: [User]
    user(id: Int!): User
		todos(user_id: Int!): [Todo]
	}

	type Mutation {
		createUser(email: String, first_name: String, last_name: String): User
    createTodo(user_id: Int, content: String, important: Boolean): Todo
    updateUser(id: Int!, email: String, first_name: String, last_name: String): User
		updateTodo(id: Int!, content: String, important: Boolean): Todo
	}
`;

const resolvers = {
  Query: {
    users: () => User.query(),
    todos: (obj, args, context, info) => Todo.query().where({ user_id: args.user_id }),
    user: (obj, args, context, info) => User.query().findById(args.id)
  },
  Todo: {
    user: todo => User.query().findById(todo.user_id)
  },
  User: {
    todos: user => Todo.query().where({ user_id: user.id })
  },
  Mutation: {
    createUser: (root, { email, first_name, last_name }) => {
      return User.query().insert({ email, first_name, last_name });
    },
    createTodo: (root, { user_id, content, important }) => {
      return Todo.query().insert({ user_id, content, important });
    },
    updateTodo: (root, { id, ...updates }) => {
      return Todo.query().patchAndFetchById(id, updates);
    },
    updateUser: (root, { id, ...updates }) => {
      return User.query().patchAndFetchById(id, updates);
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
