<<<<<<< HEAD
import React from 'react';

import { View, Text } from 'react-native';
=======
import { FlatList, View, StyleSheet, Text } from 'react-native';
>>>>>>> 45ba3ce210fb512916f1b078adc08b3e81ade1ac


const RepositoryItem = ({ 
  fullName, 
  description, 
  language, 
  stargazersCount,
  forkscount,
  reviewCount,
  ratingAverage
  }) => {
  return (
    <View>
      <Text >Full name: {fullName}</Text>
      <Text >Description: {description}</Text>
      <Text >Language: {language}</Text>
      <Text >Stars: {stargazersCount}</Text>
      <Text >Forks: {forkscount}</Text>
      <Text >Reviews: {reviewCount}</Text>
      <Text >Rating: {ratingAverage}</Text>
    </View>
  );
}

export default RepositoryItem;