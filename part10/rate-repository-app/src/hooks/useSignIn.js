import { useMutation, useApolloClient } from '@apollo/client';

import { AUTHENTICATE } from '../graphql/mutations';

import useAuthStorage from './useAuthStorage';
import { ME } from '../graphql/queries';

const useSignIn = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const [mutate, result] = useMutation(AUTHENTICATE, {
    refetchQueries: [{ query: ME }],
    update: (cache, { data }) => {
      cache.updateQuery({ query: ME }, () => data.me)
    }
  });

  

  const signIn = async ({ username, password }) => {
    const response = await mutate({
      variables: { credentials: { username, password } }
    });
    console.log('Received response:', response);
    await authStorage.setAccessToken(response.data.authenticate.accessToken);
    console.log('Access token set:', response.data.authenticate.accessToken);
    await apolloClient.resetStore();
    console.log('Apollo client store reset');

    return response;
  }

  return [signIn, result];
};

export default useSignIn;