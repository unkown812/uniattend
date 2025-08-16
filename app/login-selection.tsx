import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
// import { useAuth } from "../context/AuthContext";
// import { StorageService } from "@/utils/storage";

export default function LoginSelectionScreen() {
  const router = useRouter();
  // const { user, userType, loading, isFirstLaunch } = useAuth();

  // useEffect(() => {
  //   const checkAuthState = async () => {
  //     if (!loading) {
  //       if (isFirstLaunch) {
  //         await StorageService.setFirstLaunchComplete();
  //         router.replace("/login-selection");
  //       } else if (user && userType) {
  //         if (userType === "student") {
  //           router.replace("/subjects-students");
  //         } else if (userType === "teacher") {
  //           router.replace("/subjects-teachers");
  //         }
  //       }
  //     }
  //   };

  //   checkAuthState();
  // }, [router, user, userType, loading, isFirstLaunch]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : "height"}
    >
      <Text style={styles.title}>Who Are You ?</Text>
      <Text style={styles.subtitle}>Login to Continue</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/teacher-login")}
      >
        <Text style={styles.buttonText}>Teacher</Text>
        <Image
          source={require("../assets/images/teacher.png")}
          style={styles.buttonImage}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/student-login")}
      >
        <Text style={styles.buttonText}>Student</Text>
        <Image
          source={require("../assets/images/mortarboard.png")}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9f0",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    marginBottom: 4,
    fontWeight: "400",
    fontFamily: "ClashDisplay",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "400",
    color: "#555",
    fontFamily: "ClashDisplay",
  },
  button: {
    backgroundColor: "#a9cbb7",
    width: 350,
    height: 240,
    borderRadius: 20,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    fontFamily: "ClashDisplay",
    marginTop: 10,
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
  buttonImage: {
    marginTop: 10,
    height: 80,
    width: 80,
  },
});
