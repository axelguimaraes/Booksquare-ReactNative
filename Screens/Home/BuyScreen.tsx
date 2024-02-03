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
      photos: [
        'https://via.placeholder.com/150/photo1.jpg',
        'https://via.placeholder.com/150/photo2.jpg',
      ],
      tags: ['Drama', 'Thriller']
    },
    {
      id: 2,
      title: 'Book 2',
      description: 'Description of Book 2',
      price: 12.99,
      photos: [
        'https://via.placeholder.com/150/photo1.jpg',
        'https://via.placeholder.com/150/photo2.jpg',
      ],
      tags: ['Romance']
    },
    {
      id: 3,
      title: 'Book 3',
      description: 'Description of Book 3',
      price: 12.99,
      photos: [
        'https://via.placeholder.com/150/photo1.jpg',
        'https://via.placeholder.com/150/photo2.jpg',
      ],
      tags: ['Science Fiction']
    },
    {
      id: 4,
      title: 'Book 4',
      description: 'Description of Book 4',
      price: 12.99,
      photos: [
        'https://via.placeholder.com/150/photo1.jpg',
        'https://via.placeholder.com/150/photo2.jpg',
      ], tags: ['Fantasy']
    },
    {
      id: 5,
      title: 'Book 5',
      description: 'Description of Book 5',
      price: 12.99,
      photos: [
        'https://via.placeholder.com/150/photo1.jpg',
        'https://via.placeholder.com/150/photo2.jpg',
      ],
      tags: ['Mystery', 'Suspense']
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
