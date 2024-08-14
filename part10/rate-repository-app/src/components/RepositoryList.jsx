import React from 'react';
import { useState, useEffect } from 'react';

import { FlatList, View, StyleSheet, ActivityIndicator, Pressable, Fragment } from 'react-native';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';
import { Link } from 'react-router-native';
import {Picker} from '@react-native-picker/picker';
import Text from './Text';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

export const RepositoryListContainer = ({ repositories, loading, error }) => {
  const repositoryNodes = repositories
  ? repositories.edges.map(edge => edge.node)
  : [];

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }


  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <Link to={`/repository/${item.id}`}>
          <RepositoryItem {...item} />
        </Link>
    )}
    />
  );
};

const RepositoryList = () => {
  const [principle, setPrinciple] = useState('latest')
  const { repositories, loading, error } = useRepositories(principle);
  // const [selectedLanguage, setSelectedLanguage] = useState();

  return (
    <View>
      <Picker
        selectedValue={principle}
        onValueChange={(itemValue) =>
          setPrinciple(itemValue)
        }>
        <Picker.Item label="Latest Repositories" value="latest" />
        <Picker.Item label="Highest Rated Repositories" value="high" />
        <Picker.Item label="Lowest Rated Repositories" value="low" />
      </Picker>
      <RepositoryListContainer repositories={repositories} loading={loading} error={error}/>
    </View>
  )
};

export default RepositoryList;