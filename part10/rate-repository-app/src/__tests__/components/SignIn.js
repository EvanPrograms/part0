import React from 'react';
import { Text, View } from 'react-native';
import { SignInForm } from '../../components/SignIn';

import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
// ...


describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
      // render the SignInContainer component, fill the text inputs and press the submit button
      const onSubmit = jest.fn()
      render(<SignInForm onSubmit={onSubmit}/>)

      fireEvent.changeText(screen.getByPlaceholderText('Username'), 'kalle');
      fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');
      fireEvent.press(screen.getByText('Sign In'));


      await waitFor(() => {
        // expect the onSubmit function to have been called once and with a correct first argument
        expect(onSubmit).toHaveBeenCalledTimes(1);
        console.log(onSubmit.mock.calls[0][0]);
        expect(onSubmit.mock.calls[0][0]).toEqual({
          username: 'kalle',
          password: 'password',
        });
      });
    });

    //test

  });
});