import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { firestore, storage, auth } from "../config/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const EditProducto = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    location: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(firestore, "articulos", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        Alert.alert("Error", "No se pudo encontrar el producto");
        navigation.goBack();
      }
    };
    fetchProduct();
  }, [productId]);

  const handleInputChange = (name, value) => {
    setProduct({ ...product, [name]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    //   aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProduct({ ...product, image: result.assets[0].uri });
    }
  };

  const handleUpdate = async () => {
    if (!product.name || !product.price || !product.category) {
      Alert.alert("Error", "Por favor, completa todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = product.image;
      if (product.image && product.image.startsWith("file://")) {
        const response = await fetch(product.image);
        const blob = await response.blob();
        const imageRef = ref(storage, `product_images/${Date.now()}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      const productRef = doc(firestore, "articulos", productId);
      await updateDoc(productRef, {
        ...product,
        image: imageUrl,
        price: parseFloat(product.price),
      });

      Alert.alert("Éxito", "Producto actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      Alert.alert("Error", "No se pudo actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Editar Producto</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.image} />
          ) : (
            <Icon name="camera-outline" size={24} color="#fff" />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Nombre del producto"
          placeholderTextColor="#ccc"
          value={product.name}
          onChangeText={(text) => handleInputChange("name", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Precio"
          placeholderTextColor="#ccc"
          value={product.price.toString()}
          onChangeText={(text) => handleInputChange("price", text)}
          keyboardType="numeric"
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
          placeholder="Descripción"
          placeholderTextColor="#ccc"
          value={product.description}
          onChangeText={(text) => handleInputChange("description", text)}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Ubicación"
          placeholderTextColor="#ccc"
          value={product.location}
          onChangeText={(text) => handleInputChange("location", text)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#4a00e0" />
          ) : (
            <Text style={styles.buttonText}>Actualizar Producto</Text>
          )}
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
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    color: "#fff",
  },
  imagePicker: {
    width: "100%",
    height: 200,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    color: "#fff",
    height: 50,
    paddingLeft: 15,
  },
  button: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#4a00e0",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditProducto;
