import React from 'react';
import { View, StyleSheet } from 'react-native';
import NotificationsComponent from './NotificationsComponent';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';

const Notifications = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TopBar navigation={navigation} />
            <NotificationsComponent />
            <BottomBar navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Notifications;
