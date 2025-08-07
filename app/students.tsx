import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import React, { useState } from 'react';
const students = [
  { id: '1', name: 'Arpit Salunkhe', roll: '01', sem: '5', status: 'green' },
  { id: '2', name: 'Adhya Shukla', roll: '01', sem: '5', status: 'red' },
  { id: '3', name: 'Nasha Talwar', roll: '01', sem: '5', status: 'white' },
];

export default function StudentsScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: { id: string; name: string; roll: string; sem: string; status: string } }) => (
    <TouchableOpacity style={styles.studentItem}>
      <View>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetails}>Roll: {item.roll}   Sem: {item.sem}</Text>
      </View>
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: item.status === 'white' ? '#fff' : item.status === 'green' ? '#4caf50' : '#f44336' },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <Text style={styles.subtitle}>Attendance Summary</Text>

      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.exportButton} onPress={() => { setModalVisible(true) }}>
        <Text style={styles.exportButtonText}>Export</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={styles.bottomPopupContent}>
            <TouchableOpacity style={styles.popupButton} onPress={() => { /* TODO: Handle Lecture */ }}>
              <Text style={styles.popupButtonText}>Lecture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popupButton} onPress={() => { /* TODO: Handle Month */ }}>
              <Text style={styles.popupButtonText}>Month</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popupButton} onPress={() => { /* TODO: Handle Year */ }}>
              <Text style={styles.popupButtonText}>Year</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9f0',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    marginTop: 60,
    fontSize: 52,
    color: '#000',
    fontWeight: '400',
    fontFamily: "ClashDisplay",
  },
  subtitle: {
    fontSize: 21,
    color: '#555',
    marginBottom: 20,
    fontWeight: '400',
    fontFamily: "ClashDisplay",
  },
  listContainer: {
    paddingBottom: 20,
  },
  studentItem: {
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "rgba(0, 0, 0, 0.65)",
    shadowOffset: {
      width: 2,
      height: 4
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 3,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
  },
  studentName: {
    fontSize: 28,
    color: '#000',
    fontFamily: "ClashDisplay",
    fontWeight: "400",
  },
  studentDetails: {
    fontSize: 20,
    fontFamily: "ClashDisplay",
    fontWeight: "400",
    color: '#333',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  exportButton: {
    backgroundColor: "#4a7c59",
    borderRadius: 20,
    paddingVertical: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: "#bfcbb8",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    height: 82,
    borderColor: '#000',
    borderWidth: 1,
    borderStyle: "solid"
  },
  exportButtonText: {
    color: '#000',
    fontSize: 24,
    fontFamily: "ClashDisplay",
    fontWeight: "400",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.63)',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#d3d3c9',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: "rgba(0, 0, 0, 0.65)",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 3,
  },
  popupContent: {
    width: 280,
    backgroundColor: '#d3d3c9',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: "rgba(0, 0, 0, 0.85)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.9,
    transform: [{ scale: 1 }],
  },
  bottomPopupContent: {
    width: '100%',
    backgroundColor: '#d3d3c9',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: "rgba(0, 0, 0, 0.85)",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.9,
  },
  popupButton: {
    width: '80%',
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "rgba(0, 0, 0, 0.65)",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 3,
    marginVertical: 10,
  },
  popupButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "ClashDisplay",
    color: '#000',
  },
  modalButton: {
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#000',
  },
  modalButtonText: {
    fontSize: 18,
    color: '#000',
    fontFamily: "ClashDisplay",
  },
});
