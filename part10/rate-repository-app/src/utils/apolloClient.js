import { ApolloClient, InMemoryCache } from '@apollo/client';


const createApolloClient = () => {
  return new ApolloClient({
    uri: 'http://10.0.0.108:4000/api/graphql',
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;