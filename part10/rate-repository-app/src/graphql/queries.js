import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query($orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, $searchKeyword: String) {
    repositories(orderBy: $orderBy, orderDirection: $orderDirection, searchKeyword: $searchKeyword) {
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

export const SEARCH_REPOSITORIES = gql`
  query($searchKeyword: String) {
    repositories(searchKeyword: $searchKeyword) {
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
      reviews {
        edges {
          node {
            text
            id
            user {
              username
            }
            createdAt
            rating
          }
        }
      }
    }
  }
`;

export const GET_REVIEWS = gql`
  query($idToSearch: ID!) {
    repository(id: $idToSearch) {
      reviews {
        edges {
          node {
            id
            text
            rating
            createdAt
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`;


// other queries...