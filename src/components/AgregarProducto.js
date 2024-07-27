import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { firestore, storage, auth } from "../config/firebaseConfig";
import { setDoc, doc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";

const AddProductScreen = ({ navigation }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    location: "",
    phoneNumber: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitas otorgar permisos para acceder a la galería."
        );
      }
    })();
  }, []);

  const handleInputChange = (name, value) => {
    if (name === "category") {
      setProduct({ ...product, [name]: value.toLowerCase() });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProduct({ ...product, image: result.assets[0].uri });
    }
  };

  const compressImage = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  };

  const validateProduct = () => {
    if (!product.name.trim()) return "El nombre es obligatorio";
    if (!product.description.trim()) return "La descripción es obligatoria";
    if (isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0)
      return "El precio debe ser un número válido mayor que cero";
    if (!product.category.trim()) return "La categoría es obligatoria";
    if (!product.location.trim()) return "La ubicación es obligatoria";
    if (!product.phoneNumber.trim())
      return "El número de teléfono es obligatorio";
    if (!product.image) return "Debe seleccionar una imagen";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateProduct();
    if (error) {
      Alert.alert("Error de validación", error);
      return;
    }

    setIsLoading(true);
    try {
      const compressedImageUri = await compressImage(product.image);
      const response = await fetch(compressedImageUri);
      const blob = await response.blob();
      const imageRef = ref(storage, `images/${new Date().getTime()}`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      const newProductRef = doc(collection(firestore, "articulos"));
      const currentUser = auth.currentUser;
      await setDoc(newProductRef, {
        id: newProductRef.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        location: product.location,
        phoneNumber: product.phoneNumber,
        image: imageUrl,
        userId: currentUser.uid,
      });

      setProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        location: "",
        phoneNumber: "",
        image: null,
      });

      Alert.alert(
        "Producto publicado",
        "Tu producto ha sido publicado correctamente",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Productos en Ventas");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error detallado:", error);
      Alert.alert(
        "Error al publicar producto",
        "Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Publicar Nuevo Producto</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del producto"
          placeholderTextColor="#ccc"
          value={product.name}
          onChangeText={(text) => handleInputChange("name", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          placeholderTextColor="#ccc"
          value={product.description}
          onChangeText={(text) => handleInputChange("description", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Precio"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
          value={product.price}
          onChangeText={(text) => handleInputChange("price", text)}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={product.category}
            style={styles.picker}
            onValueChange={(itemValue) =>
              handleInputChange("category", itemValue)
            }
          >
            <Picker.Item label="Selecciona una categoría" value="" />
            <Picker.Item label="Tecnología" value="tecnologia" />
            <Picker.Item label="Ropa" value="ropa" />
            <Picker.Item label="Hogar" value="hogar" />
            <Picker.Item label="Moto" value="moto" />
            <Picker.Item label="Carro" value="carro" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Ubicación"
          placeholderTextColor="#ccc"
          value={product.location}
          onChangeText={(text) => handleInputChange("location", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de Teléfono"
          placeholderTextColor="#ccc"
          keyboardType="phone-pad"
          value={product.phoneNumber}
          onChangeText={(text) => handleInputChange("phoneNumber", text)}
        />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Icon name="camera-outline" size={24} color="#fff" />
          <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        {product.image && (
          <Image source={{ uri: product.image }} style={styles.image} />
        )}
        {isLoading && <ActivityIndicator size="large" color="#fff" />}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>Publicar Producto</Text>
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
  pickerContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    color: "#fff",
    height: 60,
    paddingLeft: 15,
  },
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  imagePickerText: {
    color: "#fff",
    marginLeft: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#4a00e0",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddProductScreen;
