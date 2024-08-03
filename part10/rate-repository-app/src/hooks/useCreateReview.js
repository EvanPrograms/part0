import { useMutation, useApolloClient } from '@apollo/client';

import { SUBMIT_REVIEW } from '../graphql/mutations';

import useAuthStorage from './useAuthStorage';
import { ME } from '../graphql/queries';

const useSubmitReview = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const [mutate, result] = useMutation(SUBMIT_REVIEW);

  // const token = authStorage.getAccessToken()
  // console.log('retrieving token', token)

  const submitReview = async (review) => {
    const response = await mutate({
      variables: { review }
    });
    // console.log('Received response:', response);
    // await authStorage.setAccessToken(response.data.authenticate.accessToken);
    // console.log('Access token set:', response.data.authenticate.accessToken);
    // await apolloClient.resetStore();
    // console.log('Apollo client store reset');

    return response;
  }

  return [submitReview, result];
};

export default useSubmitReview;