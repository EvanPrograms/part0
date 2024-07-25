import Text from './Text';
import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import theme from '../theme';
import * as yup from 'yup';

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
  .required('Username is required'),
  password: yup
  .string()
  .required('Password is required')
});


const SignInForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
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
        secureTextEntry={true}
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.errors}>{formik.errors.password}</Text>
      )}
      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>
  )  
};

const SignIn = () => {
  const onSubmit = values => {
    if (values.username && values.password) {
      console.log(values);
    }
  }
  
  // return <Text>The sign-in view</Text>;
  return <SignInForm onSubmit={onSubmit}/>
};

export default SignIn;