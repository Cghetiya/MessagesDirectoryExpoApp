// screens/MessageScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MessageScreen({
  route,
  messagesMap,
  addMessage,
  editMessage,
  deleteMessage
}) {
  const { title } = route.params;
  const messages = messagesMap[title] || [];

  // Add‐Message modal state
  const [addVisible, setAddVisible] = useState(false);
  const [newMsg, setNewMsg]       = useState('');

  // Edit‐Message modal state
  const [editVisible, setEditVisible] = useState(false);
  const [msgIndex, setMsgIndex]       = useState(null);
  const [msgText, setMsgText]         = useState('');

  // Handlers
  const openEdit = (index, text) => {
    setMsgIndex(index);
    setMsgText(text);
    setEditVisible(true);
  };

  const handleEditSave = () => {
    if (!msgText.trim()) return;
    editMessage(title, msgIndex, msgText.trim());
    setEditVisible(false);
  };

  const confirmDelete = index =>
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMessage(title, index)
        }
      ]
    );

  const handleAddSave = () => {
    if (!newMsg.trim()) return;
    addMessage(title, newMsg.trim());
    setNewMsg('');
    setAddVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>No messages yet.</Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.msgText}>• {item}</Text>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => openEdit(index, item)}>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={20}
                  color="#007AFF"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(index)}>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={20}
                  color="red"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Floating + Add Message button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Message Modal */}
      <Modal visible={addVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Message</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Type your message here..."
              value={newMsg}
              onChangeText={setNewMsg}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setAddVisible(false)} />
              <Button title="Add"    onPress={handleAddSave}        />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Message Modal */}
      <Modal visible={editVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Message</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={msgText}
              onChangeText={setMsgText}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setEditVisible(false)} />
              <Button title="Save"   onPress={handleEditSave}       />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, padding: 20, backgroundColor: '#fff' },
  header:       { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  empty:        { fontStyle: 'italic', color: '#666', marginTop: 20, textAlign: 'center' },

  item:         {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    backgroundColor:'#ddeeff',
    padding:        12,
    borderRadius:   6,
    marginBottom:   10,
  },
  msgText:      { flex:1, fontSize:16 },
  iconRow:      { flexDirection:'row', marginLeft:8 },

  addButton:    {
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

  modalOverlay: { flex:1, backgroundColor:'#00000055', justifyContent:'center', padding:20 },
  modalContent: { backgroundColor:'#fff', borderRadius:8, padding:20 },
  modalTitle:   { fontSize:18, fontWeight:'600', marginBottom:10 },
  input:        { borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:8, marginBottom:15 },
  modalButtons: { flexDirection:'row', justifyContent:'space-between' },
});
