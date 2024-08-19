import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = (principle, searchKeyword) => {
  let ordering = {};
  switch (principle) {
    case 'latest':
      ordering = { "orderBy": "CREATED_AT", "orderDirection": "DESC"};
      break;
    case 'high':
      ordering = { "orderBy": "RATING_AVERAGE", "orderDirection": "DESC"};
      break;
    case 'low':
      ordering = { "orderBy": "RATING_AVERAGE", "orderDirection": "ASC"};
      break;
    default:
      ordering = { "orderBy": "CREATED_AT", "orderDirection": "DESC" };
  }

  const { data, loading, error, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network',
    variables: {...ordering, searchKeyword, first: 5}

  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repositories.pageInfo.endCursor,
        ...ordering,
        searchKeyword,
        first: 8
      },
    });
  };

  // const repositories = data ? data.repositories : null;
  

  // return { repositories, loading, error };

  return {
    repositories: data?.repositories,
    fetchMore: handleFetchMore,
    loading,
    error,
    ...result,
  };
};

export default useRepositories;