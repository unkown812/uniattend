import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const subjects = [
  { id: '1', name: 'DSD', status: 'red' },
  { id: '2', name: 'IOT', status: 'green' },
  { id: '3', name: 'EVS', status: 'green' },
];

export default function SubjectsScreen() {
  const router = useRouter();
  
  const renderItem = ({ item }: { item: { id: string; name: string; status: string } }) => (
    <TouchableOpacity 
      style={styles.subjectItem} 
      onPress={() => router.push(`/subject-detail?subjectId=${item.id}&subjectName=${item.name}`)}
    >
      <Text style={styles.subjectText}>{item.name}</Text>
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: item.status === 'green' ? '#4caf50' : '#f44336' },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Subjects</Text>
          <Text style={styles.subtitle}>List of all subjects</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.profileIcon}>
            <MaterialIcons name="person" size={24} color="#004d40" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={subjects}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => { /* TODO: Add subject */ }}>
        <Text style={styles.addButtonText}>Add Subject</Text>
      </TouchableOpacity>

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
  headerRow: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: '#a9cbb7',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#000',
    fontFamily: "ClashDisplay",
    fontWeight: "400",
  },
  exportButtonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  profileIcon: {
    backgroundColor: '#a9cbb7',
    borderRadius: 12,
    padding: 4,
  },
  title: {
    fontSize: 50,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  subtitle: {
    fontSize: 24,
    color: '#555',
    marginBottom: 20,
    fontWeight: '400',
    fontFamily: "ClashDisplay",
  },
  listContainer: {
    paddingBottom: 20,
  },
  subjectItem: {
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    paddingVertical: 40,
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
  subjectText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'regular',
    fontFamily: "ClashDisplay",
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    paddingVertical: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
    fontFamily: "ClashDisplay",
  },

});
