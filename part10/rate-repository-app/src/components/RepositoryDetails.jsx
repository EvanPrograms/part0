import React from "react";
import RepositoryItem from "./RepositoryItem";
import { useParams } from "react-router-native";
import { SINGLE_REPOSITORY, GET_REVIEWS } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { View, Image, ActivityIndicator } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import theme from '../theme';
import Text from './Text'
import ReviewItem from "./ReviewItem";

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flexSubContainer: {
    flexDirection: 'column',
    marginLeft: 20,
    flex: 1,
    marginBottom: 10,
  },
  flexCountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 40
  },
  container: {
    paddingTop: 10,
    backgroundColor: theme.colors.textWhite,
    marginVertical: 5
    
  },
  fullName: {
    marginBottom: 2
  },
  description: {
    marginBottom: 2
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: 10
  },
  languageBox: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.textWhite,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignSelf: 'flex-start'
  }
})

const RepositoryDetails = () => {
  const { id } = useParams();
  console.log('repo ID', id)
  const { data, loading, error } = useQuery(SINGLE_REPOSITORY, {
    variables: { idToSearch: id },
    fetchPolicy: 'cache-and-network'
  });

  


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (!data || !data.repository) {
    return (
      <View style={styles.container}>
        <Text>No data available</Text>
      </View>
    );
  }

  // const { reviews, reviewLoading, reviewError } = useQuery(GET_REVIEWS, {
  //   variables: { idToSearch: id }
  // })

  // const reviewNodes = reviews
  // ? reviews.repository.reviews.edges.map(edge => edge.node)
  // : [];
  // const reviewNodes = reviews.repository.reviews.edges.map(edge => edge.node);
  // const reviewNodes = reviews?.repository?.reviews?.edges?.map(edge => edge.node) || [];
  
  // const reviews = data.reviews ? data.reviews.edges.map(e => e.node) : [];
  const reviews = data.repository.reviews.edges.map(edge => edge.node);
  // const reviews = data.repository.reviews?.edges?.map(edge => edge.node) || [];
  // const reviews = ['yes', 'yes']
  console.log('reviews', reviews)

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={() => <RepositoryItem {...data.repository} detailed={true} />}
      // ...
    />

    // <RepositoryItem {...data.repository} detailed={true} reviews={reviews}/>
  )
}

export default RepositoryDetails;