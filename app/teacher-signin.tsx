import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SEMESTERS } from "../types/database";
import { supabase } from "@/utils/supabase";
import * as Device from "expo-device";

export default function TeacherLoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTeacherLogin = async () => {
    if (!username.trim() || !password.trim() || !course || !semester) {
      Alert.alert("Error", "Please fill in all fields");
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
      const deviceInfo = await collectDeviceInfo();

      const { data: teacher, error } = await supabase
        .from("teachers")
        .insert({
          username: username.trim(),
          password: password.trim(),
          course: course,
          semester: parseInt(semester),
          created_at: new Date().toISOString(),
          device_info: deviceInfo
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting teacher:", error);
        Alert.alert("Registration Error", "Failed to save teacher data");
        return;
      }
      router.push({
        pathname: "/subjects-teachers",
        params: { teacherId: teacher.id, course, semester },
      });
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "Invalid credentials"
      );
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
        <Image
          source={require("../assets/images/teacherIllustration.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
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
              <Picker.Item
                label="Diploma In Pharmacy"
                value="diploma-pharmacy"
              />
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
        </View>

        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={semester}
              onValueChange={(itemValue) => setSemester(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Semester" value="" />
              {SEMESTERS.map((semesterOption) => (
                <Picker.Item
                  key={semesterOption.toString()}
                  label={semesterOption.toString()}
                  value={semesterOption.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleTeacherLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/teacher-login")}>
          <Text style={styles.newHereText}>Already User </Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginTop: 50,
    width: 150,
    height: 150,
    borderRadius: 70,
    marginVertical: 30,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
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
    borderRadius: 30,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
  },
  button: {
    width: "70%",
    height: 60,
    backgroundColor: "#4a7c59",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#000",
    fontSize: 26,
    fontWeight: "100",
    fontFamily: "ClashDisplay",
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
  pickerWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontWeight: "100",
    fontFamily: "ClashDisplay",
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
  },
  pickerOptionSelected: {
    backgroundColor: "#4a7c59",
    borderColor: "#4a7c59",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#333",
  },
  pickerOptionTextSelected: {
    color: "#fff",
  },
  picker: {
    width: "100%",
    color: "#000",
    fontWeight: "100",
    fontFamily: "ClashDisplay",
    fontSize: 16,
    paddingHorizontal: 15,
  },
  newHereText: {
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 24,
    textDecorationLine: "underline",
    fontWeight: "100",
    fontFamily: "ClashDisplay",
  },
});