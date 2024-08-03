import React, { Fragment } from 'react';

import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import Constants from 'expo-constants';
import AppBarTab from './AppBarTab';
import theme from '../theme';
import { Link } from "react-router-native";
import { ME } from '../graphql/queries';
import { useQuery } from '@apollo/client';
import useSignOut from "../hooks/useSignOut";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar
  },
  signOutText: {
    padding: 20,
    color: theme.colors.textWhite,
    fontSize: theme.fontSizes.subheading,
    // fontWeight: theme.fontWeights.bold,
  },
  // ...
});

const AppBar = () => {
  const signOut = useSignOut();
  const { data, loading, error } = useQuery(ME, {
    fetchPolicy: 'cache-and-network'
  });

  console.log('AppBar query data:', data);
  console.log('AppBar loading:', loading);
  console.log('AppBar error:', error);

  if (loading) return <Text>loading user...</Text>
  if (error) return <Text>Error fetching user data</Text>;

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab link='/' >Repositories</AppBarTab>
        {/* <AppBarTab link='/reviewform'>Create a Review</AppBarTab> */}
        {data?.me ? (
          <Fragment>
            <AppBarTab link='/reviewform'>Create a Review</AppBarTab>
            <Pressable onPress={signOut}>
              <Text style={styles.signOutText}
              >
                Sign out
              </Text>
            </Pressable>
          </Fragment>
        ) : (
          <AppBarTab link="/signin">Sign in</AppBarTab>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;