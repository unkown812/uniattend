import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../utils/supabase";
import { Picker } from "@react-native-picker/picker";
import { SEMESTERS } from "../types/database";
import * as Device from "expo-device";
import * as Application from "expo-application";
import * as SecureStore from "expo-secure-store";

export default function TeacherSigninScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getOrCreateDeviceId = async () => {
    let storedId = await SecureStore.getItemAsync("device_id");
    if (!storedId) {
      let androidId = '';
      try {
        androidId = Application.getAndroidId ? Application.getAndroidId() : Date.now().toString();
      } catch {
        androidId = Date.now().toString();
      }
      const newId = `${androidId}-${Math.random()
        .toString(36)
        .substring(2, 10)}`;
      await SecureStore.setItemAsync("device_id", newId);
      storedId = newId;
    }
    return storedId;
  };

  const collectDeviceInfo = async () => {
    const uniqueId = await getOrCreateDeviceId();

    const clean = (value: any) =>
      String(value || "unknown").replace(/\r?\n|\r/g, " ").trim();

    const infoArray = [
      `brand: ${clean(Device.brand)}`,
      `model: ${clean(Device.modelName)}`,
      `os_name: ${clean(Device.osName)}`,
      `os_version: ${clean(Device.osVersion)}`,
      `device_type: ${clean(Device.deviceType)}`,
    ];

    return { infoArray, uniqueId: clean(uniqueId) };
  };

  const handleSignIn = async () => {
    if (!name || !password || !course || !semester) {
      Alert.alert("Error", "Please enter all fields");
      return;
    }

    setLoading(true);
    try {
      const { infoArray } = await collectDeviceInfo();

      const { data: teacher, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("username", name.trim())
        .eq("password", password.trim())
        .eq("course", course)
        .eq("semester", parseInt(semester))
        .single();

      if (error) throw error;

      if (!teacher) {
        Alert.alert("Error", "Invalid credentials");
        return;
      }

      const match = teacher.device_info?.includes(`model: ${Device.modelName}`);

      if (!match) {
        Alert.alert("Error", "Login not allowed from this device");
        return;
      }

      Alert.alert("Success", "Login successful!");
      router.push({
        pathname: "/subjects-teachers",
        params: { studentId: teacher.id, course, semester },
      });
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "Login failed. Please try again.");
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
        <Text style={styles.title}>Staff Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
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
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing In..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/teacher-signin")}>
          <Text style={styles.newHereText}>New Here ?</Text>
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
    // padding: 20,
    alignItems: "center",
  },
  image: {
    marginTop: 150,
    width: 150,
    height: 150,
    borderRadius: 70,
    marginVertical: 30,
  },
  title: {
    fontSize: 35,
    marginBottom: 50,
    fontWeight: "regular",
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
  button: {
    width: "70%",
    height: 60,
    backgroundColor: "#4a7c59",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#000",
    fontSize: 26,
    fontWeight: "regular",
    fontFamily: "ClashDisplay",
  },
  newHereText: {
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 24,
    textDecorationLine: "underline",
    fontWeight: "100",
    fontFamily: "ClashDisplay",
  },
  pickerContainer: {
    width: "90%",
    height: 50,
    backgroundColor: "rgba(0, 64, 48, 0.25)",
    marginBottom: 20,
    borderRadius: 30,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    justifyContent: "center",
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    color: "#000",
    fontWeight: "100",
    fontFamily: "ClashDisplay",
    fontSize: 16,
  },
});
