import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import io from 'socket.io-client';

// Initialize the socket connection with the server's IP
// const socket = io('http://103.81.68.146:3000', {
const socket = io('http://10.50.20.56:3000');

const currentUserId = 'Og1yoviJ1hMLlG9GAAAm'; // Replace with actual user ID

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for chat messages from the server
    socket.on('chat message', (data) => {
      // Add new message to the message list
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit('chat message', message); // Send message to the server
      setMessage(''); // Clear input after sending
    }
  };

  const getMessageStyle = (userId) => {
    // Different colors for different users
    if (userId === messages[0]?.userId) {
      return styles.myMessage;
    } else {
      return styles.otherMessage;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, getMessageStyle(item.userId)]}>
            <Text style={styles.userId}>{item?.userId}: </Text>
            <Text style={styles.message}>{item?.message}</Text>
            {/* <Text style={styles.message}>{item}</Text> */}
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, color:'#fff' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
  messageContainer: { flexDirection: 'row', marginVertical: 5, padding: 10, borderRadius: 5 },
  userId: { fontWeight: 'bold', color:'#000' },
  message: { marginLeft: 5, backgroundColor: '#f0f0f0', padding: 5, color:'#000'  },
  myMessage: { backgroundColor: '#add8e6', alignSelf: 'flex-end' }, // Light blue for the current user
  otherMessage: { backgroundColor: '#f0f0f0', alignSelf: 'flex-start' }, // Grey for other users
});

export default ChatScreen;
