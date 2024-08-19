import React from "react";

import { useQuery } from "@apollo/client";
import { GET_REVIEWS } from "../graphql/queries";
import Text from "./Text";
import { View, Pressable, Alert } from 'react-native';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { FlatList, StyleSheet } from 'react-native';
import theme from '../theme';
import { useNavigate } from "react-router-native";
import useDeleteReview from "../hooks/useDeleteReview";

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flexReviewContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 5,
  },
  flexReviewSubContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
    flexShrink: 1
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
    gap: 40,
    // marginBottom: 10
  },
  flexGithubContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 20,
    // flex: 1,
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
  },
  githubBox: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.textWhite,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  separator: {
    height: 10,
  },
  ratingBubble: {
    width: 50,
    height: 50,
    backgroundColor: theme.colors.textWhite,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center' 
  },
  myReviewBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
    marginHorizontal: 10
  },
  viewBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    margin: 10,
    flex: 1,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center'
  }
})


const ReviewItem = ({ review, me }) => {
  const navigate = useNavigate();

  const dateFormatted = format(review.createdAt, "LL.dd.y")
  console.log(dateFormatted)

  const handleViewRepository = () => {
    navigate(`/repository/${review.repositoryId}`)
  }

  const [deleteReview] = useDeleteReview();
  // console.log(review.id)

  const handleDeleteReview = () => {
    // deleteReview(review.id)
    // console.log('deleted this review', review.id)
    Alert.alert('Delete Review', 'Are you sure you want to delete this review?', [
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await deleteReview(review.id);
            console.log('Review deleted');
          } catch (error) {
            console.log('Failed to delete review', error);
          }
        },
        style: 'destructive'
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancelled'),
        style: 'cancel'
      }
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.flexReviewContainer}>
        <View style={styles.ratingBubble}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{review.rating}</Text>
        </View>
        <View style={styles.flexReviewSubContainer}>
          {me ? (
            <Text fontWeight='bold'>{review.repository.ownerName}/{review.repository.name}</Text>
          ) : (
            <Text fontWeight='bold'>{review.user.username}</Text>
          )}
          <Text color='textSecondary'>{dateFormatted}</Text>
          <Text>{review.text}</Text>
          
        </View>
      </View>
      {me && (
            <View style={styles.myReviewBox}>
              <View style={[styles.viewBox, { backgroundColor: theme.colors.primary }]}>
                <Pressable onPress={handleViewRepository}>
                  <Text color="textWhite" fontWeight='bold'>View Repository</Text>
                </Pressable>
              </View>
              <View style={[styles.viewBox, { backgroundColor: theme.colors.delete }]}>
                <Pressable onPress={handleDeleteReview}>
                  <Text color="textWhite" fontWeight='bold'>Delete Review</Text>
                </Pressable>
              </View>
          </View>
          )}
    </View>
    
  )


};

export default ReviewItem;