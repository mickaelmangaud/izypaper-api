import { gql } from 'apollo-server-express';

export default gql`  
  type Query {
    currentUser: User
    user(id: ID): User
    users: [User]!
  }

  type Mutation {
    createUser(input: UserInput): User
    deleteUser(id: ID): User
    updateUser(id: ID, input: UserInput): User
  }

  type User {
    id: ID
    googleID: String
    facebookID: String
    locale: String
    email: String
    password: String
    firstName: String
    lastName: String
    avatarURL: String
  }

  input UserInput {
    email: String
    password: String
  }
`;