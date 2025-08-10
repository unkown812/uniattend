import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../utils/supabase";

export default function StudentSigninScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");
  const [sem, setSem] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleStudentSignIn = async () => {
    if (!name || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // Cross-check input data with database
      const { data: student, error } = await supabase
        .from("students")
        .select("id, username, password")
        .eq("roll", parseInt(rollNo))
        .eq("course", course)
        .eq("sem", parseInt(sem))
        .eq("username", name)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          Alert.alert("Error", "Student not found. Please check your details.");
        } else {
          throw error;
        }
        return;
      }

      if (student.password !== password) {
        Alert.alert("Error", "Invalid password. Please try again.");
        return;
      }

      router.push({
        pathname: "/subjects-students",
        params: { studentId: student.id, course, sem }
      });

    } catch (error: any) {
      console.error("Sign in error:", error);
      const errorMessage = error?.message || error?.details || "Failed to sign in";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Image
        source={require("../assets/images/professor.png")}
        style={styles.image}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={course}
          onValueChange={(itemValue: string) => setCourse(itemValue)}
          style={styles.picker}
          dropdownIconColor="#555"
        >
          <Picker.Item label="Enter Course" value="" />
          <Picker.Item label="Diploma In Administration Services" value="diploma-administration-services" />
          <Picker.Item label="Diploma In Apparel Manufacture and Design" value="diploma-apparel-manufacture-design" />
          <Picker.Item label="Diploma In Electronics" value="diploma-electronics" />
          <Picker.Item label="Diploma In Food Technology" value="diploma-food-technology" />
          <Picker.Item label="Diploma In Interior Design" value="diploma-interior-design" />
          <Picker.Item label="Diploma In Medical Laboratory Technology" value="diploma-medical-lab-tech" />
          <Picker.Item label="Diploma In Ophthalmic Technology" value="diploma-ophthalmic-tech" />
          <Picker.Item label="Diploma In Pharmacy" value="diploma-pharmacy" />
          <Picker.Item label="Diploma In Jewellery Design & Manufacture" value="diploma-jewellery-design" />
          <Picker.Item label="B.Voc In Optometry" value="bvoc-optometry" />
          <Picker.Item label="B.Voc In Fashion Design" value="bvoc-fashion-design" />
          <Picker.Item label="B.Voc In Food Processing Technology" value="bvoc-food-processing" />
          <Picker.Item label="B.Voc In Interior Design" value="bvoc-interior-design" />
          <Picker.Item label="B.Voc In Jewellery Design" value="bvoc-jewellery-design" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sem}
          onValueChange={(itemValue: string) => setSem(itemValue)}
          style={styles.picker}
          dropdownIconColor="#555"
        >
          <Picker.Item label="Enter Semester" value="" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
          <Picker.Item label="6" value="6" />
          <Picker.Item label="7" value="7" />
          <Picker.Item label="8" value="8" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Roll no."
        value={rollNo}
        onChangeText={setRollNo}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleStudentSignIn}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Continue"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/student-login')}>
        <Text style={styles.newHereText}>Already User </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9f0",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  image: {
    marginTop: 10,
    width: 280,
    height: 280,
    borderRadius: 70,
    marginVertical: 30,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    marginTop: 40,
    fontWeight: "100",
    fontFamily: "ClashDisplay",
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "rgba(0, 64, 48, 0.25)",
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "100",
    fontFamily: "ClashDisplay",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    borderRadius: 30,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
  },
  pickerContainer: {
    width: "90%",
    height: Platform.OS === "android" ? 50 : undefined,
    backgroundColor: "rgba(0, 64, 48, 0.25)",
    marginVertical: 8,
    justifyContent: "center",
    fontSize: 16,
    fontWeight: "100",
    fontFamily: "ClashDisplay",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    borderRadius: 30,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
  },
  picker: {
    width: "100%",
    color: "#000",
    fontWeight: "100",
    fontFamily: "ClashDisplay",
    fontSize: 16,
    paddingHorizontal: 15,
  },
  button: {
    width: "70%",
    height: 60,
    backgroundColor: "#4a7c59",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    marginTop: 50,
  },
  buttonText: {
    color: "#000",
    fontSize: 26,
    fontWeight: "100",
    fontFamily: "ClashDisplay",
  },
  newHereText: {
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '100',
    fontFamily: "ClashDisplay",
  },
});