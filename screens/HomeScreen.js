import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({
  navigation,
  directories,
  messagesMap,
  addGroup,
  editGroup,
  deleteGroup,
}) {
  // State for Add Directory Modal
  const [addVisible, setAddVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // State for Edit Directory Modal
  const [editVisible, setEditVisible] = useState(false);
  const [oldTitle, setOldTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');

  // Handlers
  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addGroup(newTitle, newMessage);
    setNewTitle('');
    setNewMessage('');
    setAddVisible(false);
  };

  const openEdit = (title) => {
    setOldTitle(title);
    setEditTitle(title);
    setEditVisible(true);
  };
  const handleEdit = () => {
    if (!editTitle.trim()) return;
    editGroup(oldTitle, editTitle);
    setEditVisible(false);
  };

  const confirmDelete = (title) => {
    Alert.alert(
      'Delete Directory',
      `Delete "${title}" and all its messages?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteGroup(title) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select or Create a Directory</Text>

      <FlatList
        data={directories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
  <View style={styles.item}>
    {/* Directory Title: only this part is touchable for navigation */}
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('MessageScreen', {
          title: item.title,
          messages: messagesMap[item.title] || [],
        })
      }
    >
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
    {/* Icon Row: each icon touchable individually */}
    <View style={styles.iconRow}>
      <TouchableOpacity
        onPress={() => openEdit(item.title)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons name="pencil-outline" size={20} color="#007AFF" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => confirmDelete(item.title)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons name="delete-outline" size={20} color="red" />
      </TouchableOpacity>
    </View>
  </View>
)}

      />

      {/* Floating + Add Directory */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Directory Modal */}
      <Modal visible={addVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Directory</Text>
            <TextInput
              style={styles.input}
              placeholder="Directory Name"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Initial Message"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setAddVisible(false)} />
              <Button title="Add" onPress={handleAdd} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Directory Modal */}
      <Modal visible={editVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Directory</Text>
            <TextInput
              style={styles.input}
              placeholder="New Name"
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setEditVisible(false)} />
              <Button title="Save" onPress={handleEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading:     { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  item:        {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    backgroundColor:'#ddeeff',
    padding:        15,
    borderRadius:   8,
    marginBottom:   10,
  },
  itemText:    { fontSize: 18, flex: 1 },
  iconRow:     { flexDirection: 'row', marginLeft: 10, gap: 14 },
  addButton:   {
    position:       'absolute',
    right:          20,
    bottom:         40,
    backgroundColor:'#007AFF',
    width:           55,
    height:          55,
    borderRadius:    28,
    alignItems:      'center',
    justifyContent:  'center',
    elevation:       4,
  },
  // modal styles:
  modalOverlay:{ flex:1, backgroundColor:'#00000055', justifyContent:'center', padding:20 },
  modalContent:{ backgroundColor:'#fff', borderRadius:8, padding:20 },
  modalTitle:  { fontSize:18, fontWeight:'600', marginBottom:10 },
  input:       { borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:8, marginBottom:15 },
  modalButtons:{ flexDirection:'row', justifyContent:'space-between' },
});
