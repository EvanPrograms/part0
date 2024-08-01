import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query {
    repositories {
      edges {
        node {
          fullName
          description
          ownerAvatarUrl
          language
          forksCount
          ratingAverage
          reviewCount
          stargazersCount
          id
          url
        }
      }
    }
  }
`;

export const ME = gql`
  query {
    me {
      id
      username
    }
  }
`

export const SINGLE_REPOSITORY = gql`
  query($idToSearch: ID!) {
    repository(id: $idToSearch) {
      fullName
      description
      ownerAvatarUrl
      language
      forksCount
      ratingAverage
      reviewCount
      stargazersCount
      id
      url
    }
  }
`;


// other queries...