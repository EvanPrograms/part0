import { useMutation, useApolloClient } from '@apollo/client';

import { CREATE_USER } from '../graphql/mutations';

import useAuthStorage from './useAuthStorage';
import { ME } from '../graphql/queries';

const useSignUp = () => {
  // const authStorage = useAuthStorage();
  // const apolloClient = useApolloClient();
  const [mutate, result] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: ME }],
    update: (cache, { data }) => {
      cache.updateQuery({ query: ME }, () => data.me)
    }
  });

  

  const signUp = async ({ username, password }) => {
    const response = await mutate({
      variables: { user: { username, password } }
    });
    // console.log('Received response:', response);
    // await authStorage.setAccessToken(response.data.authenticate.accessToken);
    // console.log('Access token set:', response.data.authenticate.accessToken);
    // await apolloClient.resetStore();
    // console.log('Apollo client store reset');

    return response;
  }

  return [signUp, result];
};

export default useSignUp;