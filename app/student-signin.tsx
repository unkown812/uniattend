import { Picker } from "@react-native-picker/picker";
import React, { useState,useEffect } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Alert,
  BackHandler
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../utils/supabase";
import * as Device from "expo-device";

export default function StudentSigninScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");
  const [sem, setSem] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStudentSignIn = async () => {
    if (!name || !password || !course || !sem || !rollNo) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const collectDeviceInfo = async () => {

      const clean = (value: any) =>
        String(value || "unknown").replace(/\r?\n|\r/g, " ").trim();

      return [
        `brand: ${clean(Device.brand)}`,
        `model: ${clean(Device.modelName)}`,
        `os_name: ${clean(Device.osName)}`,
        `os_version: ${clean(Device.osVersion)}`,
        `device_type: ${clean(Device.deviceType)}`,
      ];
    };

    setLoading(true);
    try {
      const deviceInfoArray = await collectDeviceInfo();

      const { data: student, error } = await supabase
        .from("students")
        .insert({
          username: name,
          password: password,
          course,
          sem: parseInt(sem),
          roll: parseInt(rollNo),
          created_at: new Date().toISOString(),
          device_info: deviceInfoArray
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (student.password !== password) {
        Alert.alert("Error", "Invalid password. Please try again.");
        return;
      }

      router.push({
        pathname: "/subjects-students",
        params: { studentName: name, course, sem },
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      Alert.alert("Error", error?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
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
            <Picker.Item
              label="Diploma In Administration Services"
              value="diploma-administration-services"
            />
            <Picker.Item
              label="Diploma In Apparel Manufacture and Design"
              value="diploma-apparel-manufacture-design"
            />
            <Picker.Item
              label="Diploma In Electronics"
              value="diploma-electronics"
            />
            <Picker.Item
              label="Diploma In Food Technology"
              value="diploma-food-technology"
            />
            <Picker.Item
              label="Diploma In Interior Design"
              value="diploma-interior-design"
            />
            <Picker.Item
              label="Diploma In Medical Laboratory Technology"
              value="diploma-medical-lab-tech"
            />
            <Picker.Item
              label="Diploma In Ophthalmic Technology"
              value="diploma-ophthalmic-tech"
            />
            <Picker.Item label="Diploma In Pharmacy" value="diploma-pharmacy" />
            <Picker.Item
              label="Diploma In Jewellery Design & Manufacture"
              value="diploma-jewellery-design"
            />
            <Picker.Item label="B.Voc In Optometry" value="bvoc-optometry" />
            <Picker.Item
              label="B.Voc In Fashion Design"
              value="bvoc-fashion-design"
            />
            <Picker.Item
              label="B.Voc In Food Processing Technology"
              value="bvoc-food-processing"
            />
            <Picker.Item
              label="B.Voc In Interior Design"
              value="bvoc-interior-design"
            />
            <Picker.Item
              label="B.Voc In Jewellery Design"
              value="bvoc-jewellery-design"
            />
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <Picker.Item key={num} label={`${num}`} value={`${num}`} />
            ))}
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
          <Text style={styles.newHereText}>Already User? </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9f0",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff9f0",
    borderRadius: 20,
    // padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginTop: 10,
    width: 150,
    height: 150,
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
    textDecorationLine: "underline",
    fontWeight: "100",
    fontFamily: "ClashDisplay",
  },
});
