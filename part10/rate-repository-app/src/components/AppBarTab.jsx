import React from 'react';

import { Pressable, Text, StyleSheet } from "react-native";
import theme from "../theme";
import { Link } from "react-router-native";

const styles = StyleSheet.create({
  tabText: {
    color: theme.colors.textWhite,
    padding: 20,
    fontSize: theme.fontSizes.subheading,
    fontFamily: theme.fonts.main
  },
});

const onPressFunction = (children, link) => {
  console.log('yay!')
}

const AppBarTab = ({children, link}) => (
  <Pressable onPress={onPressFunction(children)}>
      <Link to={link}>
        <Text style={styles.tabText}>{children}</Text>
      </Link>
  </Pressable>
);

export default AppBarTab;