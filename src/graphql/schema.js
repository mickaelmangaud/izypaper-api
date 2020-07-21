import { gql } from 'apollo-server-express';

export default gql`
  enum Role {
    ADMIN
    USER
    GUEST
  }

  directive @auth(requires: Role!) on FIELD_DEFINITION

  type Query {
    currentUser: User
    user(id: ID): User @auth(requires: ADMIN)
    users: [User]! @auth(requires: ADMIN)
  }

  type Mutation {
    createUser(input: UserInput): User
    deleteUser(id: ID): User
    updateUser(id: ID, input: UserInput): User
  }

  type User {
    id: ID!
    email: String!
    password: String!
    roles: [Role!]! 
    locale: String
    firstName: String!
    lastName: String!
    googleID: String
    facebookID: String
    avatarURL: String
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    roles: [Role]! = [USER]
  }
`;