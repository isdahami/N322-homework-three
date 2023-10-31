import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Appbar,
  List,
  Modal,
  Button,
  TextInput,
  IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen({ navigation }) {
  // State
  const [visible, setVisible] = useState(false);
  const [listName, setListName] = useState('');
  const [lists, setLists] = useState([]);

  // Load lists from AsyncStorage when the component mounts
  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('lists');
      if (jsonValue !== null) {
        const parsedLists = JSON.parse(jsonValue);
        setLists(parsedLists);
      }
    } catch (e) {
      console.error('Error loading lists:', e);
    }
  };

  // List Actions
  const addItem = async () => {
    const newList = { name: listName, items: [] };

    // Add the new list to the component's state
    setLists((prevLists) => [...prevLists, newList]);

    // Update AsyncStorage
    try {
      const jsonValue = await AsyncStorage.getItem('lists');
      if (jsonValue !== null) {
        const parsedLists = JSON.parse(jsonValue);

        // Merge the new list with the existing lists
        const updatedLists = [...parsedLists, newList];

        // Save the updated lists back to AsyncStorage
        await AsyncStorage.setItem('lists', JSON.stringify(updatedLists));
      } else {
        // If no existing lists, create a new array with the new list
        const newLists = [newList];

        // Save the new list to AsyncStorage
        await AsyncStorage.setItem('lists', JSON.stringify(newLists));
      }
    } catch (e) {
      console.error('Error adding a new list:', e);
    }

    // Clear input and hide modal
    setListName('');
    hideModal();
  };

  // Consolidated delete function
  const deleteList = async (listName) => {
    try {
      // Remove the list from the component's state
      setLists((prevLists) =>
        prevLists.filter((list) => list.name !== listName)
      );

      // Load the existing lists from AsyncStorage
      const jsonValue = await AsyncStorage.getItem('lists');
      if (jsonValue !== null) {
        const parsedLists = JSON.parse(jsonValue);

        // Filter out the deleted list
        const updatedLists = parsedLists.filter(
          (list) => list.name !== listName
        );

        // Save the updated lists back to AsyncStorage
        await AsyncStorage.setItem('lists', JSON.stringify(updatedLists));
      }
    } catch (e) {
      console.error('Error removing list from AsyncStorage:', e);
    }
  };

  // Modal Functions
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20 };

  const currentDate = new Date();
  // Format the date as a string, for example: "October 23, 2023"
  const formattedDate = currentDate.toLocaleDateString();

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appBarHead}>
        <Appbar.Content
          title="Lists"
          titleStyle={styles.appTitle}
          subtitle={formattedDate}
          subtitleStyle={styles.appDate}
        />
      </Appbar.Header>

      <View style={styles.addListBtnView}>
        <Button
          icon="plus-circle-outline"
          onPress={showModal}
          style={styles.addListBtn}
          labelStyle={{ color: '#000' }}>
          Add List
        </Button>
      </View>
      <View style={styles.list}>
        {lists.map((list) => (
          <List.Item
            style={styles.displayListName}
            key={list.name}
            title={list.name}
            onPress={() => navigation.navigate('DetailListScreen', list)}
            right={(props) => (
              <IconButton
                icon="delete"
                size={20}
                onPress={() => deleteList(list.name)}
              />
            )}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <Icon
          name="home"
          size={24}
          color="#000"
          style={styles.icon}
          onPress={() => navigation.navigate('Home')}
        />
        <Icon name="user" size={23} color="#000" style={styles.icon} />
      </View>

      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}>
        <TextInput
          label="Add list?"
          style={styles.textInput}
          value={listName}
          onChangeText={setListName}
        />
        <Button onPress={hideModal} labelStyle={{ color: '#000' }}>
          Cancel
        </Button>
        <Button onPress={addItem} labelStyle={{ color: '#000' }}>
          Add New List
        </Button>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fad102',
    padding: 20,
  },
  list: {
    flex: 1,
    backgroundColor: '#fad102',
  },
  textInput: {
    marginBottom: 10,
  },
  appBarHead: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  appDate: {
    fontSize: 14,
    color: 'gray',
  },
  addListBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 300,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  addListBtnView: {
    padding: 20,
    flex: 0.06,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayListName: {
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  icon: {
    flex: 1,
    width: '100',
    color: '#fff',
    textAlign: 'center',
    padding: 15,
    backgroundColor: '#000',
  },
});
