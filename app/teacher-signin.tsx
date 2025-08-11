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

export default function TeacherSigninScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!name || !password) {
      Alert.alert("Error", "Please enter both name and password");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("username", name)
        .eq("password", password)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        Alert.alert("Success", "Login successful!");
        router.push("/subjects-teachers");
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
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

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing In..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/teacher-login")}>
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
    padding: 20,
    alignItems: "center",
  },
  image: {
    marginTop: 130,
    width: 340,
    height: 340,
    borderRadius: 70,
    marginVertical: 30,
  },
  title: {
    fontSize: 35,
    marginBottom: 100,
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
    fontSize: 16,
    textDecorationLine: "underline",
    fontWeight: "100",
    fontFamily: "ClashDisplay",
  },
});
