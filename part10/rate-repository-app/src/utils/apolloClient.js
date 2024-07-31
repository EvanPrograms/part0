import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import Constants from 'expo-constants';
import { setContext } from '@apollo/client/link/context';

const { APOLLO_URI } = Constants.expoConfig.extra;

const httpLink = createHttpLink({
  uri: APOLLO_URI,
});

// const createApolloClient = () => {
//   return new ApolloClient({
//     // uri: 'http://10.0.0.108:4000/api/graphql',
//     uri: Constants.expoConfig.extra.APOLLO_URI,
//     cache: new InMemoryCache(),
//   });
// };

const createApolloClient = (authStorage) => {
  const authLink = setContext(async (_, { headers }) => {
    try {
      const accessToken = await authStorage.getAccessToken();
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    } catch (e) {
      console.log(e);
      return {
        headers,
      };
    }
  });
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;