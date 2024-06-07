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
    published,
    genres
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
export const GET_BOOKS_BY_GENRE = gql`
query GetBooksByGenre($genre: String!) {
  allBooks(genre: $genre) {
    title
    author {
      name
    }
    published
  }
}
`

export const GET_ME = gql`
query {
  me {
  username
  favoriteGenre
  }
}
`