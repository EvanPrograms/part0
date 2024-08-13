import Text from './Text';
import React from 'react';
import { View, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { useFormik } from 'formik';
import theme from '../theme';
import * as yup from 'yup';
import useSignUp from '../hooks/useSignUp';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from "react-router-native";

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
  username: yup
    .string()
    .min(5, 'Username must be at least 5 characters')
    .max(30, 'Username must be 30 charcters or less')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .max(50, 'Password must be 50 charcters or less')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], "Passwords don't match")
    .required('Password confirm is required')
});


export const SignUpForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: ''
    },
    validationSchema,
    onSubmit
  });

  return (
    <View style={styles.flexContainer}>
      <TextInput
        style={styles.flexItem}
        placeholder="Username"
        placeholderTextColor={theme.colors.placeholder}
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={styles.errors}>{formik.errors.username}</Text>
      )}
      <TextInput
        style={styles.flexItem}
        placeholder="Password"
        placeholderTextColor={theme.colors.placeholder}
        // secureTextEntry={true}
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.errors}>{formik.errors.password}</Text>
      )}
      <TextInput
        style={styles.flexItem}
        placeholder="Password Confirmation"
        placeholderTextColor={theme.colors.placeholder}
        // secureTextEntry={true}
        value={formik.values.passwordConfirmation}
        onChangeText={formik.handleChange('passwordConfirmation')}
      />
      {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
        <Text style={styles.errors}>{formik.errors.passwordConfirmation}</Text>
      )}
      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  )  
};

const SignUp = () => {
  const [signUp] = useSignUp();
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values, { resetForm }) => {
    const { username, password } = values;

    try {
      const { data } = await signUp({ username, password });
      // TODO : TEMP FIX ANDROID BUG Amplify first signin redirect
      await signIn({ username, password });
      if (Platform.OS === 'android') {
        setTimeout(async () => {
          await signIn({ username, password });
        }, 1000);
      }
      console.log('Sign in successful:', data);
      if (data) {
        navigate('/');
        resetForm();
      }
    } catch (e) {
      console.log('Sign in error:', e);
    }
  };
  
  // return <Text>The sign-in view</Text>;
  return <SignUpForm onSubmit={onSubmit}/>
};

export default SignUp;