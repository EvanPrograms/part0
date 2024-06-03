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
    author,
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