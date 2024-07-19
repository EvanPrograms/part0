import React from 'react';

import { View, Image } from 'react-native';
import Text from './Text'
import { FlatList, StyleSheet } from 'react-native';
import theme from '../theme';
import InfoBox from './InfoBox';

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

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num;
};


const RepositoryItem = ({ 
  fullName, 
  description, 
  language, 
  stargazersCount,
  forksCount,
  reviewCount,
  ratingAverage,
  ownerAvatarUrl
  }) => {
  return (
    <View style={styles.container}>
      <View style={styles.flexContainer}>
        <Image
          style={styles.avatar}
          source={{
            uri: ownerAvatarUrl
          }}
        />
        <View style={styles.flexSubContainer}>
          <Text fontWeight="bold" style={styles.fullName}>{fullName}</Text>
          <Text color="textSecondary" style={styles.description}>{description}</Text>
          <View style={styles.languageBox}>
            <Text color="textWhite">{language}</Text>
          </View>
        </View>
      </View>
      <View style={styles.flexCountContainer}>
        <InfoBox count={formatNumber(stargazersCount)} info="Stars"/>
        <InfoBox count={formatNumber(forksCount)} info="Forks"/>
        <InfoBox count={formatNumber(reviewCount)} info="Reviews"/>
        <InfoBox count={ratingAverage} info="Rating"/>
      </View>
    </View>
  );
}

export default RepositoryItem;