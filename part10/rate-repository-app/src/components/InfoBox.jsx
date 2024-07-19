import React from 'react';

import { View, Image } from 'react-native';
import Text from './Text'
import { FlatList, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  infoBox: {
    alignItems: 'center'
  }
})

const InfoBox = ({count, info}) => {
  return (
    <View style={styles.infoBox}>
      <Text fontWeight='bold'>
        {count}
      </Text>
      <Text color='textSecondary'>
        {info}
      </Text>
    </View>
  )
};

export default InfoBox;