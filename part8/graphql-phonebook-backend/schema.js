const typeDefs = `
  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }

  type Subscription {
    personAdded: Person!
  }

  type Token {
    value: String!
  }

  type Address {
    city: String
    street: String
  }

  enum YesNo {
    YES
    NO
  }
  
  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }

  type Person {
    name: String!
    phone: String
    address: Address
    friendOf: [User!]!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(
      name: String!
      phone: String!
    ): Person

    createUser(
      username: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token  
    
    addAsFriend(
      name: String!
    ): User
  }
`

module.exports = typeDefs