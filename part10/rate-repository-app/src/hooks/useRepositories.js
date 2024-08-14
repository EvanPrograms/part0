import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = (principle) => {
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

  const { data, loading, error } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network',
    variables: ordering
  })

  const repositories = data ? data.repositories : null;
  

  return { repositories, loading, error };
};

export default useRepositories;