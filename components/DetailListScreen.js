import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet } from 'react-native';
import {
  Appbar,
  Modal,
  TextInput,
  Button,
  List,
  IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DetailListScreen({ navigation, route }) {
  let listObj = route.params;
  const [visible, setVisible] = useState();
  const [itemName, setItemName] = useState();
  const [listItem, setListItem] = useState();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const addItem = () => {
    hideModal();
    let newItem = { itemName: itemName };
    listObj.items.push(newItem);

    // Save the updated list to AsyncStorage
    saveUpdatedList(listObj);
  };

  const deleteItem = (item) => {
    // Remove the item from the list
    listObj.items = listObj.items.filter((a) => a.itemName !== item.itemName);
    setListItem(listObj.items);

    // Save the updated list to AsyncStorage
    saveUpdatedList(listObj);
  };

  const saveUpdatedList = async (updatedList) => {
    try {
      // Load the existing lists from AsyncStorage
      const jsonValue = await AsyncStorage.getItem('lists');
      if (jsonValue !== null) {
        const parsedLists = JSON.parse(jsonValue);

        // Find the index of the updated list in the parsedLists
        const listIndex = parsedLists.findIndex(
          (list) => list.name === updatedList.name
        );

        // Update the specific list with the new items
        parsedLists[listIndex] = updatedList;

        // Save the updated lists back to AsyncStorage
        await AsyncStorage.setItem('lists', JSON.stringify(parsedLists));
      }
    } catch (e) {
      console.error('Error updating list in AsyncStorage:', e);
    }
  };

  const containerStyle = { backgroundColor: 'white', padding: 20 };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBarHead}>
        <Appbar.Action
          icon="keyboard-backspace"
          onPress={() => navigation.navigate('Home')}
        />
        <Appbar.Content
          title={listObj.name}
          subtitle="Item Details"
          style={styles.listNameTxt}
        />
      </Appbar.Header>
      <View style={styles.addListBtnView}>
        <Button
          icon="plus-circle-outline"
          onPress={showModal}
          style={styles.addListBtn}
          labelStyle={{ color: '#000' }}>
          Add Item
        </Button>
      </View>
      <View style={styles.lists}>
        {listObj.items.map((item) => (
          <List.Item
            style={styles.displayItemName}
            title={item.itemName}
            right={(props) => (
              <IconButton
                icon="delete"
                size={20}
                onPress={() => {
                  deleteItem(item);
                }}
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
        <Text style={styles.paragraph}>Add item to list.</Text>
        <TextInput
          label="Add list?"
          style={styles.textInput}
          onChangeText={setItemName}
        />
        <Button onPress={hideModal}>Cancel</Button>
        <Button onPress={addItem}>Add New List</Button>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fad102',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lists: {
    backgroundColor: '#fad102',
  },
  appBarHead: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  listNameTxt: {
    textTransform: 'capitalize',
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
  displayItemName: {
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
