import {
  StyleSheet,
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import * as Location from "expo-location";
import { turkishCities } from "./constants/TurkishCities";
import { hijriMonths } from "./constants/HijriMonths";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from 'expo-notifications';

import Home from "./screens/Home";
import Settings from "./screens/Settings";
import Calendar from "./screens/Calendar";
import Quran from './screens/Quran';
import QiblaScreen from './screens/QiblaScreen';
import PrayersScreen from './screens/PrayersScreen';
import HadithScreen from './screens/HadithScreen';

export default function App() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
  const [monthlyPrayers, setMonthlyPrayers] = useState(null);
  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState("");
  const [modalVisible, setModalVisible] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("home");

  useEffect(() => {
    // Başlangıçta direkt şehir seçme modalını göster
    setModalVisible(true);
    createNotificationChannel();
  }, []);

  

  const createNotificationChannel = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('prayer-times', {
        name: 'Namaz Vakitleri',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'ezan',
        enableVibrate: true,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2E7D32',
      });
    }
  };

  const handleLocationDetection = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Konum İzni Gerekli",
          "Otomatik konum tespiti için konum iznine ihtiyacımız var.",
          [{ text: "Tamam" }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode[0]) {
        const city = geocode[0].city || geocode[0].subregion;
        if (city) {
          setCityName(city);
          setModalVisible(false);
          await fetchPrayerTimes(city, "Turkey");
        } else {
          Alert.alert(
            "Hata",
            "Konumunuz tespit edilemedi. Lütfen şehrinizi manuel seçin."
          );
        }
      }
    } catch (error) {
      console.warn(error);
      Alert.alert(
        "Hata",
        "Konum alınırken bir hata oluştu. Lütfen şehrinizi manuel seçin."
      );
    }
  };

  const handleCitySelect = async (city) => {
    setCityName(city);
    setModalVisible(false);
    await fetchPrayerTimes(city, "Turkey");
  };

  const fetchPrayerTimes = async (city, country) => {
    try {
      // Günlük namaz vakitleri
      const dailyResponse = await axios.get(
        "https://api.aladhan.com/v1/timingsByCity",
        {
          params: {
            city: city,
            country: country,
            method: 13,
          },
        }
      );

      setPrayerTimes(dailyResponse.data.data.timings);
      const hijriDateStr = dailyResponse.data.data.date.hijri.date;

      const formatHijriDate = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        const monthName = hijriMonths[parseInt(month)];
        return `${parseInt(day)} ${monthName} ${year}`;
      };

      setHijriDate(formatHijriDate(hijriDateStr));

      // Aylık namaz vakitleri
      const today = new Date();
      const monthlyResponse = await axios.get(
        "https://api.aladhan.com/v1/calendarByCity",
        {
          params: {
            city: city,
            country: country,
            method: 13,
            month: today.getMonth() + 1,
            year: today.getFullYear(),
          },
        }
      );

      if (monthlyResponse.data && monthlyResponse.data.data) {
        setMonthlyPrayers(monthlyResponse.data.data);
        console.log("Monthly prayers data loaded successfully");
      } else {
        console.error("Invalid monthly prayers data format:", monthlyResponse.data);
      }
    } catch (e) {
      console.warn("API Error:", e);
      Alert.alert("Hata", "Namaz vakitleri alınırken bir hata oluştu.");
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <Home
            prayerTimes={prayerTimes}
            cityName={cityName}
            hijriDate={hijriDate}
            onLocationChange={() => setModalVisible(true)}
            onNavigate={setCurrentScreen}
          />
        );
      case "Takvim":
        return (
          <Calendar 
            monthlyPrayers={monthlyPrayers} 
            onBack={() => setCurrentScreen("home")} 
          />
        );
      case "Kuran":
        return <Quran onBack={() => setCurrentScreen("home")} />;
      case "Ayarlar":
        return (
          <Settings 
            onLocationChange={() => setModalVisible(true)}
            onBack={() => setCurrentScreen("home")} 
          />
        );
      case "Kıble":
        return <QiblaScreen onBack={() => setCurrentScreen("home")} />;
      case "Dualar":
        return <PrayersScreen onBack={() => setCurrentScreen("home")} />;
      case "Hadis-i Şerif":
        return <HadithScreen onBack={() => setCurrentScreen("home")} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (!cityName) {
            Alert.alert(
              "Uyarı",
              "Lütfen bir şehir seçin veya konumunuzu tespit edin."
            );
            return;
          }
          setModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Şehir Seçiniz</Text>
          <Text style={styles.modalDescription}>
            Namaz vakitlerini görüntülemek için şehrinizi seçin
          </Text>
          <View style={styles.listContainer}>
            <FlatList
              data={turkishCities}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.cityItem}
                  onPress={() => handleCitySelect(item)}
                >
                  <Text style={styles.cityText}>{item}</Text>
                </Pressable>
              )}
              keyExtractor={(item) => item}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.choiceButton]}
              onPress={handleLocationDetection}
            >
              <Text style={styles.choiceButtonText}>
                🎯 Konumumu Otomatik Tespit Et
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2E7D32",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  prayerTimesContainer: {
    gap: 8,
  },
  prayerTime: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalView: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2E7D32",
  },
  cityItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cityText: {
    fontSize: 16,
    color: "#333",
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    marginBottom: 80,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 10,
  },
  choiceButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#2E7D32",
  },
  choiceButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
  },
  settingsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  activeTab: {
    backgroundColor: "#f8f8f8",
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
  activeTabText: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
});
