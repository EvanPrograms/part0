import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import RepositoryList from './RepositoryList';
import AppBar from './AppBar';
import theme from '../theme';
import SignIn from './SignIn';
import RepositoryDetails from './RepositoryDetails';
import RepositoryItem from './RepositoryItem';
import CreateReview from './CreateReview';
import SignUp from './SignUp';
import MyReviews from './MyReviews';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: theme.colors.mainBackground,
    fontFamily: theme.fonts.main
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<RepositoryList />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/repository/:id" element={<RepositoryDetails />} />
        <Route path="/reviewform" element={<CreateReview />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="myreviews" element={<MyReviews />} />
      </Routes>
    </View>
  );
};

export default Main;