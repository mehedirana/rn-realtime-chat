import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import io from 'socket.io-client';

// Initialize the socket connection with the server's IP
// const socket = io('http://103.81.68.146:3000', {
const socket = io('http://10.50.20.56:3000', {
  transports: ['websocket', 'polling'], // Attempt both transports
  reconnection: true,  // Enable reconnection
  reconnectionAttempts: 5, // Try reconnecting up to 5 times
  reconnectionDelay: 2000, // Reconnect after 2 seconds
  forceNew: true,  // Always create a new connection
  timeout: 10000   // Set a timeout for the connection
});


const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log('Attempting to connect to the server...');

    // Debug socket connection
    socket.on('connect', () => {
      console.log('Connected to server. Socket ID:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server. Reason:', reason);
    });

    // Listen for chat messages from the server
    socket.on('chat message', (message) => {
      console.log('Received message from server:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Handle any potential error events
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Clean up the socket connection when component unmounts
    return () => {
      console.log('Disconnecting from server...');
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      console.log('Sending message to server:', message);
      socket.emit('chat message', message); // Send message to the server
      setMessage(''); // Clear input after sending
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.message}>{item}</Text>}
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
  container: { flex: 1, padding: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
  message: { padding: 5, backgroundColor: '#f0f0f0', marginVertical: 5 },
});

export default ChatScreen;
