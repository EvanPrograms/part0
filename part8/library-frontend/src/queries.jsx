import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors  {
    name,
    born,
    bookCount
  }
}
`
export const ALL_BOOKS = gql`
query {
  allBooks {
    title,
    author {
      name
    },
    published
  }
}`

export const EDIT_BIRTH = gql`
mutation editAuthor($name: String!, $born: Int!) {
  editAuthor(name: $name, setBornTo: $born) {
    name
    born
  }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
    }
  }
`