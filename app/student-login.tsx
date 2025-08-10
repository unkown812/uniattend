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
  const [course, setCourse] = useState("");
  const [sem, setSem] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');

  const router = useRouter();

  const handleStudentSignIn = async () => {
    if (!name || !course || !sem || !rollNo) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // Check if student exists
      const { data: existingStudent, error: checkError } = await supabase
        .from("students")
        .select("id")
        .eq("roll", parseInt(rollNo))
        .eq("course", course)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingStudent) {
        // Student exists, navigate directly
        router.push({
          pathname: "/subjects-students",
          params: { studentId: existingStudent.id, course, sem }
        });
        return;
      }

      // Insert new student - matching exact database fields
      const { data: newStudent, error: insertError } = await supabase
        .from("students")
        .insert({
          username: name,
          course,
          sem: parseInt(sem),
          roll: parseInt(rollNo),
          password: "default123"
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      Alert.alert("Success", "Student profile created successfully");
      router.push({
        pathname: "/subjects-students",
        params: { id: newStudent.id, course, sem }
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
      <Text style={styles.title}>Student Login</Text>
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

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleStudentSignIn}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Continue"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/student-signin')}>
        <Text style={styles.newHereText}>New Here ? </Text>
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
    width: 340,
    height: 340,
    borderRadius: 70,
    marginVertical: 30,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    marginTop: 120,
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