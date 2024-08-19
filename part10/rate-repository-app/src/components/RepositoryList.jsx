import React from 'react';
import { useState, useEffect } from 'react';

import { FlatList, View, StyleSheet, ActivityIndicator, Pressable, Fragment } from 'react-native';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';
import { Link } from 'react-router-native';
import {Picker} from '@react-native-picker/picker';
import Text from './Text';
import { Searchbar } from 'react-native-paper';
import { useDebounce } from 'use-debounce';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

export const RepositoryListContainer = ({ repositories, loading, error, onEndReach }) => {
  renderHeader = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const props = this.props;

    return (
      <Searchbar
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
    />
    )
  }

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
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
      // ListHeaderComponent={this.renderHeader}
    />
  );
};

const RepositoryList = () => {
  const [principle, setPrinciple] = useState('latest')
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchQueryDebounce] = useDebounce(searchQuery, 500);
  const { repositories, loading, error, fetchMore } = useRepositories({
    first: 1,
    principle, 
    searchQueryDebounce});
  
  const onEndReach = () => {
    console.log('You have reached the end of the list');
    fetchMore();
  }

  return (
    <View>
      <Searchbar
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
      />
      <Picker
        selectedValue={principle}
        onValueChange={(itemValue) =>
          setPrinciple(itemValue)
        }>
        <Picker.Item label="Latest Repositories" value="latest" />
        <Picker.Item label="Highest Rated Repositories" value="high" />
        <Picker.Item label="Lowest Rated Repositories" value="low" />
      </Picker>
      <RepositoryListContainer 
        repositories={repositories} 
        loading={loading} 
        error={error}
        onEndReach={onEndReach}
        />
    </View>
  )
};

export default RepositoryList;