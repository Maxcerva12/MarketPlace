import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { auth, firestore, storage } from "../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const PerfilUsuario = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const userId = auth.currentUser.uid;
      const userDoc = await getDoc(doc(firestore, "users", userId));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      Alert.alert("Error", "No se pudo cargar la información del usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUser({ ...user, fotoUrl: result.assets[0].uri });
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profile_images/${Date.now()}`);
    await uploadBytes(imageRef, blob);
    return getDownloadURL(imageRef);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const userId = auth.currentUser.uid;
      let updatedUser = { ...user };

      if (user.fotoUrl && user.fotoUrl.startsWith("file://")) {
        const newPhotoUrl = await uploadImage(user.fotoUrl);
        updatedUser.fotoUrl = newPhotoUrl;
      }

      await updateDoc(doc(firestore, "users", userId), updatedUser);
      setUser(updatedUser);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Alert.alert("Error", "No se pudo actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return <Text>No se encontró información del usuario</Text>;
  }

  return (
    <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Tu Perfil</Text>
        <TouchableOpacity onPress={pickImage} disabled={!isEditing}>
          {user.fotoUrl ? (
            <Image source={{ uri: user.fotoUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="person-outline" size={40} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        {Object.entries(user).map(
          ([key, value]) =>
            key !== "password" &&
            key !== "fotoUrl" && (
              <TextInput
                key={key}
                style={styles.input}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                placeholderTextColor="#ccc"
                value={value}
                onChangeText={(text) => handleInputChange(key, text)}
                editable={isEditing}
              />
            )
        )}
        <TouchableOpacity
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          style={styles.button}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isEditing ? "Guardar Cambios" : "Editar Perfil"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    color: "#fff",
  },
  button: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#4a00e0",
    fontWeight: "bold",
    fontSize: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default PerfilUsuario;
