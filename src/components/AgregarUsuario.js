// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { auth, firestore } from "./firebaseConfig";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { setDoc, doc } from "firebase/firestore";
// import { Pressable } from "react-native";

// const UserProfileScreen = ({ navigation }) => {
//   const [user, setUser] = useState({
//     nombre: "",
//     edad: "",
//     genero: "",
//     direccion: "",
//     telefono: "",
//     correo: "",
//     password: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (name, value) => {
//     setUser({ ...user, [name]: value });
//   };

//   const validarYEnviarDatos = async () => {
//     const { nombre, edad, genero, direccion, telefono, correo, password } =
//       user;
//     if (
//       !nombre ||
//       !edad ||
//       !genero ||
//       !direccion ||
//       !telefono ||
//       !correo ||
//       !password
//     ) {
//       Alert.alert("Error", "Por favor, completa todos los campos.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         correo,
//         password
//       );
//       const userId = userCredential.user.uid;

//       await setDoc(doc(firestore, "users", userId), {
//         nombre,
//         edad,
//         genero,
//         direccion,
//         telefono,
//         correo,
//       });

//       setUser({
//         nombre: "",
//         edad: "",
//         genero: "",
//         direccion: "",
//         telefono: "",
//         correo: "",
//         password: "",
//       }); // Limpiar inputs

//       Alert.alert("Éxito", "Usuario registrado correctamente", [
//         {
//           text: "OK",
//           onPress: () => navigation.navigate("Productos en Ventas"),
//         },
//       ]);
//     } catch (error) {
//       console.error("Error detallado:", error);
//       let errorMessage = "Error al registrar usuario";
//       if (error.code === "auth/email-already-in-use") {
//         errorMessage = "Este correo electrónico ya está en uso.";
//       } else if (error.code === "auth/invalid-email") {
//         errorMessage = "El correo electrónico no es válido.";
//       } else if (error.code === "auth/weak-password") {
//         errorMessage = "La contraseña es demasiado débil.";
//       }
//       Alert.alert("Error", errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tu Perfil</Text>
//       {Object.keys(user).map((key) => (
//         <TextInput
//           key={key}
//           style={styles.input}
//           placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//           value={user[key]}
//           onChangeText={(text) => handleInputChange(key, text)}
//           secureTextEntry={key === "password"}
//           aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
//         />
//       ))}
//       <Pressable
//         onPress={validarYEnviarDatos}
//         style={({ pressed }) => [
//           styles.button,
//           { backgroundColor: pressed ? "#45a049" : "#4CAF50" },
//         ]}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="white" />
//         ) : (
//           <Text style={styles.buttonText}>Registrarse</Text>
//         )}
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   button: {
//     width: "100%",
//     padding: 15,
//     borderRadius: 5,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });

// export default UserProfileScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { auth, firestore, storage } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

const UserProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    nombre: "",
    edad: "",
    genero: "",
    direccion: "",
    telefono: "",
    correo: "",
    password: "",
    foto: null,
  });
  const [isLoading, setIsLoading] = useState(false);

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
      setUser({ ...user, foto: result.assets[0].uri });
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profile_images/${Date.now()}`);
    await uploadBytes(imageRef, blob);
    return getDownloadURL(imageRef);
  };

  const validarYEnviarDatos = async () => {
    const {
      nombre,
      edad,
      genero,
      direccion,
      telefono,
      correo,
      password,
      foto,
    } = user;
    if (
      !nombre ||
      !edad ||
      !genero ||
      !direccion ||
      !telefono ||
      !correo ||
      !password
    ) {
      Alert.alert(
        "Error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        correo,
        password
      );
      const userId = userCredential.user.uid;

      let fotoUrl = null;
      if (foto) {
        fotoUrl = await uploadImage(foto);
      }

      await setDoc(doc(firestore, "users", userId), {
        nombre,
        edad,
        genero,
        direccion,
        telefono,
        correo,
        fotoUrl,
      });

      setUser({
        nombre: "",
        edad: "",
        genero: "",
        direccion: "",
        telefono: "",
        correo: "",
        password: "",
        foto: null,
      });

      Alert.alert("Éxito", "Usuario registrado correctamente", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Productos en Ventas"),
        },
      ]);
    } catch (error) {
      console.error("Error detallado:", error);
      let errorMessage = "Error al registrar usuario";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este correo electrónico ya está en uso.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "El correo electrónico no es válido.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña es demasiado débil.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Tu Perfil</Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage}>
              {user.foto ? (
                <Image source={{ uri: user.foto }} style={styles.image} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>Agregar foto</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          {Object.keys(user).map((key) => {
            if (key !== "foto") {
              return (
                <TextInput
                  key={key}
                  style={styles.input}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={user[key]}
                  onChangeText={(text) => handleInputChange(key, text)}
                  secureTextEntry={key === "password"}
                  placeholderTextColor="#ccc"
                />
              );
            }
            return null;
          })}
          <Pressable
            onPress={validarYEnviarDatos}
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
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
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
    marginBottom: 30,
    color: "#fff",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    color: "#fff",
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
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  placeholderText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UserProfileScreen;
