import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { firestore, auth } from "../config/firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

import Icon from "react-native-vector-icons/Ionicons";

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(firestore, "articulos", productId));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          setProduct(productData);

          // Comprueba si el usuario actual es el propietario del producto
          const currentUser = auth.currentUser;
          if (currentUser && productData.userId === currentUser.uid) {
            setIsOwner(true);
          }
        } else {
          console.log("No existe tal documento");
        }
      } catch (error) {
        console.error("Error al recuperar el producto: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleContactPress = () => {
    if (product.phoneNumber) {
      Linking.openURL(
        `https://api.whatsapp.com/send/?phone=${product.phoneNumber}`
      );
    } else {
      Alert.alert("Error", "Número de teléfono no disponible");
    }
  };

  const handleDeletePress = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este producto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, "articulos", productId));
              Alert.alert("Éxito", "El producto ha sido eliminado.");
              navigation.goBack();
            } catch (error) {
              console.error("Error al eliminar el producto: ", error);
              Alert.alert("Error", "No se pudo eliminar el producto.");
            }
          },
        },
      ]
    );
  };

  const handleEditPress = () => {
    // Navega a la pantalla de edición del producto
    navigation.navigate("Editar producto", { productId });
  };

  if (loading) {
    return (
      <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  if (!product) {
    return (
      <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.container}>
        <Text style={styles.errorText}>No se encontró el producto.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{product.name}</Text>
          {isOwner && (
            <View style={styles.ownerButtons}>
              <TouchableOpacity
                onPress={handleEditPress}
                style={styles.iconButton}
              >
                <Icon name="create-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeletePress}
                style={styles.iconButton}
              >
                <Icon name="trash-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {product.image && (
          <Image source={{ uri: product.image }} style={styles.image} />
        )}
        <View style={styles.detailContainer}>
          <DetailRow
            icon="pricetag-outline"
            label="Precio"
            value={`$${product.price} COP`}
          />
          <DetailRow
            icon="apps-outline"
            label="Categoría"
            value={product.category}
          />
          <DetailRow
            icon="document-text-outline"
            label="Descripción"
            value={product.description}
          />
          <DetailRow
            icon="location-outline"
            label="Ubicación"
            value={product.location}
          />
        </View>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactPress}
        >
          <Icon
            name="logo-whatsapp"
            size={24}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.contactText}>Contáctanos por WhatsApp</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <Icon name={icon} size={24} color="#4a00e0" style={styles.rowIcon} />
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 320,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 10,
  },
  detailContainer: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rowIcon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a00e0",
    width: 100,
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  contactButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#25D366",
    borderRadius: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  contactText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },

  titleContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "left",
    marginBottom: 20,
  },
  ownerButtons: {
    flexDirection: "row-reverse",
  },
  iconButton: {
    marginLeft: 15,
  },
});

export default ProductDetailScreen;
