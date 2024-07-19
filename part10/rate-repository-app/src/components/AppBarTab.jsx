import React from 'react';

import { Pressable, Text, StyleSheet } from "react-native";
import theme from "../theme";

const styles = StyleSheet.create({
  tabText: {
    color: theme.colors.textWhite,
    padding: 20,
    fontSize: theme.fontSizes.subheading
  },
});

const onPressFunction = () => {
  console.log('yay!')
}

const AppBarTab = ({children}) => (
  <Pressable onPress={onPressFunction}>
      <Text style={styles.tabText}>{children}</Text>
  </Pressable>
);

export default AppBarTab;