import { useMutation, useApolloClient } from '@apollo/client';

import { DELETE_REVIEW } from '../graphql/mutations';

import useAuthStorage from './useAuthStorage';
import { ME } from '../graphql/queries';

const useDeleteReview = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const [mutate] = useMutation(DELETE_REVIEW);

  // const token = authStorage.getAccessToken()
  // console.log('retrieving token', token)

  const deleteReview = async (deleteReviewId) => {
    try {
      const response = await mutate({
        variables: { deleteReviewId }
      });
  
      // Refetch queries to ensure the UI is updated after deletion
      await apolloClient.refetchQueries({
        include: [ME],
      });
  
      return response;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  };

  return [deleteReview];
};

export default useDeleteReview;