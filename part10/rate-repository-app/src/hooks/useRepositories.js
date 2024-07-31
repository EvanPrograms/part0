import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = () => {
  // const [repositories, setRepositories] = useState();
  // const [loading, setLoading] = useState(false);

  // const fetchRepositories = async () => {
  //   setLoading(true);

  //   // Replace the IP address part with your own IP address!
  //   // const response = await fetch('http://10.0.0.108:5000/api/repositories');
  //   // const json = await response.json();
  //   const { data, error, loading } = useQuery(GET_REPOSITORIES, {
  //     fetchPolicy: 'cache-and-network',
  //   });

  //   setLoading(false);
  //   setRepositories(data);
  // };

  // useEffect(() => {
  //   fetchRepositories();
  // }, []);

  // return { repositories, loading, refetch: fetchRepositories };
  const { data, loading, error } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network',
  })

  const repositories = data ? data.repositories : null;
  

  return { repositories, loading, error };
};

export default useRepositories;