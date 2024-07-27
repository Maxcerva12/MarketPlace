import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const Login = ({ navigation }) => {
  const [credentials, setCredentials] = useState({
    correo: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async () => {
    const { correo, password } = credentials;
    if (!correo || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, correo, password);
      setCredentials({ correo: "", password: "" }); // Limpiar inputs
      Alert.alert("Éxito", "Inicio de sesión exitoso", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Productos en Ventas"),
        },
      ]);
    } catch (error) {
      console.error("Error detallado:", error);
      let errorMessage = "Error al iniciar sesión";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No se encontró ningún usuario con este correo.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Contraseña incorrecta.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <View style={styles.inputContainer}>
          <Icon
            name="mail-outline"
            size={24}
            color="#fff"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={credentials.correo}
            onChangeText={(text) => handleInputChange("correo", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon
            name="lock-closed-outline"
            size={24}
            color="#fff"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={credentials.password}
            onChangeText={(text) => handleInputChange("password", text)}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>
        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed
                ? "rgba(255,255,255,0.8)"
                : "rgba(255,255,255,0.9)",
            },
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#4a00e0" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    padding: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#4a00e0",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default Login;
