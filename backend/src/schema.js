import { makeExecutableSchema } from 'graphql-tools';
import User from './models/user';

const typeDefs = `
	type User {
		id: Int!
		first_name: String
		last_name: String
	}

	type Query {
		users: [User]
		user(id: Int!): User
	}

	type Mutation {
		createUser(first_name: String, last_name: String): User
	}
`;

const resolvers = {
	Query: {
		users: () => User.query()
	},
	Mutation: {
		createUser: (root, { first_name, last_name }) => {
			return User.query().insert({ first_name, last_name });
		}
	}
};

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});

export default schema;
