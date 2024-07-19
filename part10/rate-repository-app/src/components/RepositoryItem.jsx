import React from 'react';

import { View, Text } from 'react-native';


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