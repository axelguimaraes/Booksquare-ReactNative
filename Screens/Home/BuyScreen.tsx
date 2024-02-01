import React from 'react';
import { View, Text, FlatList } from 'react-native';
import BookCard from '../../Components/BookCard';

const BuyScreen = () => {
  // Dummy data books
  const dummyBooks = [
    {
      id: 1,
      title: 'Book 1',
      description: 'Description of Book 1',
      price: 10.99,
      photo: 'https://via.placeholder.com/150', // Replace with actual photo URL
    },
    {
      id: 2,
      title: 'Book 2',
      description: 'Description of Book 2',
      price: 12.99,
      photo: 'https://via.placeholder.com/150', // Replace with actual photo URL
    },
    {
      id: 3,
      title: 'Book 3',
      description: 'Description of Book 3',
      price: 9.99,
      photo: 'https://via.placeholder.com/150', // Replace with actual photo URL
    },
    {
      id: 4,
      title: 'Book 4',
      description: 'Description of Book 4',
      price: 8.99,
      photo: 'https://via.placeholder.com/150', // Replace with actual photo URL
    },
    {
      id: 5,
      title: 'Book 5',
      description: 'Description of Book 5',
      price: 11.99,
      photo: 'https://via.placeholder.com/150', // Replace with actual photo URL
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={dummyBooks}
        renderItem={({ item }) => <BookCard book={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default BuyScreen;
