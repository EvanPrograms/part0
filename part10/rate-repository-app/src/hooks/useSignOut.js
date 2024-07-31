import { useApolloClient } from "@apollo/client";
import useAuthStorage from "./useAuthStorage";

const useSignOut = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signout = async () => {
    console.log('signing out');
    await authStorage.removeAccessToken();
    apolloClient.resetStore();

  }

  return signout;
}

export default useSignOut;