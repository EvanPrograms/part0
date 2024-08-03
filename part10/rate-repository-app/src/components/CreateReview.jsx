import React from "react";
import Text from "./Text";
import * as yup from 'yup';
import { useNavigate } from "react-router-native";
import { useFormik } from 'formik';
import { View, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import theme from '../theme';
import { useMutation } from "@apollo/client";
import { SUBMIT_REVIEW } from "../graphql/mutations";
import useSubmitReview from "../hooks/useCreateReview";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 50
  },
  flexContainer: {
    flexDirection: 'column',
    padding: 10
  },
  flexItem: {
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.textSecondary,
    marginVertical: 5,
    padding: 10,
    fontFamily: theme.fonts.main,
  },
  textInput: {
    color: theme.colors.primary
  },
  button: {
    backgroundColor: theme.colors.primary,
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.textSecondary,
    marginVertical: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }, 
  buttonText: {
    color: theme.colors.textWhite,
    fontFamily: theme.fonts.main
  },
  errors: {
    color: theme.colors.error
  }
});


const validationSchema = yup.object().shape({
  owner: yup
  .string()
  .required('Repository owner name is required'),
  name: yup
  .string()
  .required('Repository name is required'),
  rating: yup
  .number()
  .min(0, 'Rating must be 0 or greater')
  .max(100, 'Rating must be 100 or less')
  .required('Rating is required'),
  review: yup
  .string()
});

const ReviewForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      owner: '',
      name: '',
      rating: '',
      review: '',
    },
    validationSchema,
    onSubmit
  })

  return (
    <View style={styles.flexContainer}>
      <TextInput
        style={styles.flexItem}
        placeholder="Repository Owner Name"
        placeholderTextColor={theme.colors.placeholder}
        value={formik.values.owner}
        onChangeText={formik.handleChange('owner')}
      />
      {formik.touched.owner && formik.errors.owner && (
        <Text style={styles.errors}>{formik.errors.owner}</Text>
      )}
      <TextInput
        style={styles.flexItem}
        placeholder="Repository Name"
        placeholderTextColor={theme.colors.placeholder}
        value={formik.values.name}
        onChangeText={formik.handleChange('name')}
      />
      {formik.touched.name && formik.errors.name && (
        <Text style={styles.errors}>{formik.errors.name}</Text>
      )}
      <TextInput
        style={styles.flexItem}
        placeholder="Rating between 0 and 100"
        placeholderTextColor={theme.colors.placeholder}
        value={formik.values.rating}
        onChangeText={formik.handleChange('rating')}
      />
      {formik.touched.rating && formik.errors.rating && (
        <Text style={styles.errors}>{formik.errors.rating}</Text>
      )}
      <TextInput
        style={styles.flexItem}
        placeholder="Review"
        placeholderTextColor={theme.colors.placeholder}
        value={formik.values.review}
        onChangeText={formik.handleChange('review')}
      />
      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Create a Review</Text>
      </Pressable>
    </View>
  )
};

const CreateReview = () => {
  // const [signIn] = useSignIn();
  const [submitReview] = useSubmitReview();
  const navigate = useNavigate();

  // const [submitReview] = useMutation(SUBMIT_REVIEW)

  // const signIn = async ({ username, password }) => {
  //   const response = await mutate({
  //     variables: { credentials: { username, password } }
  //   });

  const onSubmit = async (values, { resetForm }) => {
    const review = {
      ownerName: values.owner,
      repositoryName: values.name,
      rating: Number(values.rating),
      text: values.review
    }

    try {
      const returnedReview = await submitReview(review)
      navigate(`/repository/${returnedReview.data.createReview.repositoryId}`);
      resetForm();
      // TODO : TEMP FIX ANDROID BUG Amplify first signin redirect
      // if (Platform.OS === 'android') {
      //   setTimeout(async () => {
      //     await signIn({ username, password });
      //   }, 1000);
      // }
      // console.log('Sign in successful:', data);
      // if (data) {
      //   navigate('/signin');
      //   resetForm();
    } catch (e) {
      console.log('Submit review error', e);
    }

    // try {
    //   const { data } = await submitReview({
    //     variables: {
    //       review: {owner, name, rating, review}
    //     }
    //   });
    //   console.log('Review to submit', data);
    //   resetForm();
    //   navigate('/signin')
    // } catch (error) {
    //   console.log('Error submitting review', error);
    // }
    
  };
  
  // return <Text>The sign-in view</Text>;
  return <ReviewForm onSubmit={onSubmit}/>
};

export default CreateReview;