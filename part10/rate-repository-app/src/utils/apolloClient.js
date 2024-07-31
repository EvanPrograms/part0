import { ApolloClient, InMemoryCache } from '@apollo/client';
import Constants from 'expo-constants';


const createApolloClient = () => {
  return new ApolloClient({
    // uri: 'http://10.0.0.108:4000/api/graphql',
    uri: Constants.expoConfig.extra.APOLLO_URI,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;