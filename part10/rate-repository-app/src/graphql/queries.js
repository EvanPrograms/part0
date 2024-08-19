import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query($orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, $searchKeyword: String, $after: String, $first: Int) {
    repositories(orderBy: $orderBy, orderDirection: $orderDirection, searchKeyword: $searchKeyword, after: $after, first: $first) {
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
          cursor
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
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
  query getCurrentUser($includeReviews: Boolean = false) {
    me {
      id
      username
      reviews @include(if: $includeReviews) {
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
            repository {
              name
              ownerName
            }
            repositoryId
          }
        }
      }
    }
  }
`;

export const MY_REVIEWS = gql`
  query {
    me {
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
            repository {
              name
              ownerName
            }
          }
        }
      }
    }
  }
`;

export const SINGLE_REPOSITORY = gql`
  query($idToSearch: ID!, $first: Int, $after: String) {
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
      reviews(first: $first, after: $after) {
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
          cursor
        }
        pageInfo {
          endCursor
          startCursor
          hasNextPage
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