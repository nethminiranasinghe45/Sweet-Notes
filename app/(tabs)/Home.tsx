import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  ActivityIndicator, Modal, TextInput, Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

interface Note {
  id: number;
  title: string;
  description: string;
  date_created: string;
  category_name?: string;
}

const COLORS = ['#FEE2E2', '#FEF3C7', '#D1FAE5', '#DBEAFE', '#F5F3FF'];

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
const [selectedCategory, setSelectedCategory] = useState<number | string>('');
  const ip = "192.168.43.47";

  const fetchNotes = async () => {
    try {
      const response = await fetch(`http://${ip}/mySweetNotes_api/get_notes.php`);
      const data = await response.json();
      console.log("Fetched Data:", data); 
      setNotes(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSaveNote = async () => {
    
    if (!title.trim() || !content.trim() || !selectedCategory) {
      Alert.alert("Empty Cloud! ☁️", "Please fill in all fields");
      return;
    }
    try {
      const details = new URLSearchParams();
      details.append('title', title);
      details.append('description', content); // Use description to match your DB
  details.append('category_id', selectedCategory.toString());

      const response = await fetch(`http://${ip}/mySweetNotes_api/save_note.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: details.toString(),
      });

      const result = await response.json();
      if (result.status === "success") {
        setModalVisible(false);
        setTitle('');
        setContent('');
        setSelectedCategory(''); // Reset picker
        fetchNotes();
      }
    } catch (error) {
      Alert.alert("Error", "Check if XAMPP is running.");
    }
  };

  const openEditModal = (note: Note) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.description);

// ADD THIS LINE: Find the ID of the category based on the name
  const cat = categories.find(c => c.name === note.category_name);
  setSelectedCategory(cat ? cat.id : '');

    setEditModalVisible(true);
  };

  const handleUpdateNote = async () => {
    if (!selectedCategory) {
    Alert.alert("Wait!", "Please select a category for this cloud.");
    return;
  }
    try {
      const details = new URLSearchParams();
      details.append('id', selectedNoteId!.toString());
      details.append('title', title);
      details.append('content', content);
      details.append('category_id', selectedCategory.toString());

      const response = await fetch(`http://${ip}/mySweetNotes_api/update_note.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: details.toString(),
      });

      const result = await response.json();
      if (result.status === "success") {
        setEditModalVisible(false);
        setTitle('');
        setContent('');
    setSelectedCategory('');
        fetchNotes();
      }
    } catch (error) {
      Alert.alert("Error", "Could not update note.");
    }
  };

  //dlt
const openDeleteConfirm = (id: number) => {
  Alert.alert(
    "Delete Note 🗑️",
    "Are you sure you want to let this cloud float away?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
  try {
    const response = await fetch(`http://${ip}/mySweetNotes_api/delete_note.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });

    const result = await response.json(); 
    if (result.status === "success") {
      fetchNotes(); 
    } else {
      Alert.alert("Server Error", result.message);
    }
  } catch (error) { 
    console.error("Delete failed:", error);
    Alert.alert("Error", "Check your connection to XAMPP.");
  }
},
      },
    ]
  );
};

const fetchCategories = async () => {
  const response = await fetch(`http://${ip}/mySweetNotes_api/get_categories.php`);
  const data = await response.json();
  setCategories(data);
  }
  useEffect(() => {
  fetchNotes();
  fetchCategories(); 
  },
    []
  );

 const renderNote = ({ item, index }: { item: Note; index: number }) => (
  <TouchableOpacity 
    style={[styles.noteCard, { backgroundColor: COLORS[index % COLORS.length] }]}
    onPress={() => openEditModal(item)} 
    activeOpacity={0.7}
  >
    
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Text style={[styles.noteTitle, { flex: 1 }]} numberOfLines={1}>{item.title}</Text>
      <TouchableOpacity onPress={() => openDeleteConfirm(item.id)} style={{ paddingLeft: 10 }}>
        <Ionicons name="trash-outline" size={18} color="#D88EC0" />
      </TouchableOpacity>
    </View>

    
    {item.category_name && (
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{item.category_name.toUpperCase()}</Text>
      </View>
    )}

    
    <Text style={styles.noteContent} numberOfLines={3}>{item.description}</Text>
    
    <View style={{ marginTop: 'auto' }}>
      <Text style={styles.noteDate}>{item.date_created}</Text>
    </View>
  </TouchableOpacity>
);


  return (
    <LinearGradient colors={['#FDF2F8', '#E0F2FE']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Clouds ☁️</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => { setTitle(''); setContent(''); setModalVisible(true); }}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* ADD NOTE */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>New Note ✍️</Text>
            <TextInput style={styles.modalInput} placeholder="Note Title" value={title} onChangeText={setTitle} />

<Text style={{ color: '#D88EC0', marginBottom: 5, marginLeft: 10 }}>Select Category:</Text>
<View style={[styles.modalInput, { padding: 0 }]}> 
  <Picker
    selectedValue={selectedCategory}
    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
  >
    <Picker.Item label="Choose a category..." value="" />
    {categories.map((cat) => (
      <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
    ))}
  </Picker>
</View>

            <TextInput style={[styles.modalInput, { height: 120 }]} placeholder="Write thoughts..." multiline value={content} onChangeText={setContent} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={{color: '#718096'}}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveNote}><Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT NOTE  */}
      <Modal visible={editModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Edit Cloud ☁️</Text>
            <TextInput style={styles.modalInput} value={title} onChangeText={setTitle} />

<Text style={{ color: '#D88EC0', marginBottom: 5, marginLeft: 10 }}>Select Category:</Text>
<View style={[styles.pickerContainer]}> 
  <Picker
    selectedValue={selectedCategory}
    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
  >
    <Picker.Item label="Choose a category..." value="" />
    {categories.map((cat) => (
      <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
    ))}
  </Picker>
</View>

            <TextInput style={[styles.modalInput, { height: 150 }]} multiline value={content} onChangeText={setContent} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}><Text style={{color: '#718096'}}>Discard</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateNote}><Text style={{color: 'white', fontWeight: 'bold'}}>Update</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading ? (
        <ActivityIndicator size="large" color="#D88EC0" style={{ flex: 1 }} />
      ) : (
        <FlatList data={notes} renderItem={renderNote} keyExtractor={(item) => item.id.toString()} numColumns={2} contentContainerStyle={styles.listContent} />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#D88EC0' },
  addButton: { backgroundColor: '#F9A8D4', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  listContent: { paddingHorizontal: 15 },
  noteCard: { flex: 1, margin: 8, padding: 15, borderRadius: 25, minHeight: 180, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  noteTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A5568', marginBottom: 5 },
  noteContent: { fontSize: 13, color: '#718096', lineHeight: 18, marginBottom: 5 },
  noteDate: { fontSize: 10, color: '#A0AEC0', marginTop: 10, textAlign: 'right' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#FFF5F7', borderRadius: 40, padding: 25, borderWidth: 2, borderColor: '#F9A8D4' },
  modalHeader: { fontSize: 24, fontWeight: 'bold', color: '#D88EC0', marginBottom: 20, textAlign: 'center' },
  modalInput: { backgroundColor: 'white', borderRadius: 20, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#FBCFE8' },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  saveBtn: { backgroundColor: '#F9A8D4', padding: 12, borderRadius: 20, paddingHorizontal: 20 },
  cancelBtn: { padding: 12 },
pickerContainer: {
  backgroundColor: 'white',
  borderRadius: 20,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: '#FBCFE8',
  justifyContent: 'center', 
  height: 55,               
  },
categoryBadge: {
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  paddingHorizontal: 10,
  paddingVertical: 3,
  borderRadius: 12,
  alignSelf: 'flex-start',
  marginBottom: 8,
  marginTop: 4,
},
categoryText: {
  fontSize: 10,
  fontWeight: 'bold',
  color: '#D88EC0',
  letterSpacing: 0.5,
},
});