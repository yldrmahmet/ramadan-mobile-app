import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// Ekran boyutlarını alalım
const { width, height } = Dimensions.get("window");

// Ana ekran komponenti
const MainScreen = ({ prayerTimes, cityName, hijriDate, onLocationChange, onNavigate }) => {
  const [nextPrayer, setNextPrayer] = useState({
    name: "",
    time: "",
    remaining: "",
    current: "",
  });
  const [prayers, setPrayers] = useState({});
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");

  // Random arkaplan fotoğrafı seç
  useEffect(() => {
    const images = [
      require("../assets/ramadan-bg-1.jpg"),
      require("../assets/ramadan-bg-2.jpg"),
      require("../assets/ramadan-bg-3.jpg"),
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBackgroundImage(randomImage);
  }, []);

  // Saat ve tarih güncelleme
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setGregorianDate(
        now.toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (prayerTimes) {
      const prayerObj = {
        İmsak: prayerTimes.Fajr,
        Güneş: prayerTimes.Sunrise,
        Öğle: prayerTimes.Dhuhr,
        İkindi: prayerTimes.Asr,
        Akşam: prayerTimes.Maghrib,
        Yatsı: prayerTimes.Isha,
      };
      setPrayers(prayerObj);
      calculateNextPrayer(prayerObj);
    }
  }, [prayerTimes]);

  const calculateNextPrayer = (prayers) => {
    const now = new Date();
    let nextPrayerName = "";
    let nextPrayerTime = "";
    let currentPrayer = "";
    let minDiff = Infinity;

    Object.entries(prayers).forEach(([name, time], index, array) => {
      const [hours, minutes] = time.split(":");
      const prayerTime = new Date();
      prayerTime.setHours(parseInt(hours), parseInt(minutes), 0);

      let diff = prayerTime - now;
      if (diff < 0) {
        prayerTime.setDate(prayerTime.getDate() + 1);
        diff = prayerTime - now;
      }

      // Şu anki vakti hesapla
      const prevPrayerTime = new Date(prayerTime);
      prevPrayerTime.setDate(prevPrayerTime.getDate() - 1);
      if (now >= prevPrayerTime && now < prayerTime) {
        currentPrayer = name;
      }

      if (diff < minDiff && diff > 0) {
        minDiff = diff;
        nextPrayerName = name;
        nextPrayerTime = time;
      }
    });

    setNextPrayer({
      name: nextPrayerName,
      time: nextPrayerTime,
      remaining: `${Math.floor(minDiff / (1000 * 60 * 60))} saat ${Math.floor((minDiff % (1000 * 60 * 60)) / (1000 * 60))} dakika`,
      current: currentPrayer,
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    headerContainer: {
      height: height * 0.28,
      width: "100%",
      overflow: "hidden",
    },
    backgroundImage: {
      width: "100%",
      height: "100%",
    },
    backgroundImageStyle: {
      width: "100%",
      height: "100%",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    timeText: {
      fontSize: Math.min(width * 0.12, 48),
      color: "#fff",
      fontWeight: "bold",
      textShadowColor: "rgba(0,0,0,0.75)",
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    dateText: {
      fontSize: Math.min(width * 0.045, 18),
      color: "#fff",
      marginTop: 4,
      textShadowColor: "rgba(0,0,0,0.75)",
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    hijriDateText: {
      fontSize: Math.min(width * 0.04, 16),
      color: "#fff",
      marginTop: 4,
      textShadowColor: "rgba(0,0,0,0.75)",
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    mainCard: {
      flex: 1,
      backgroundColor: "#fff",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      marginTop: -height * 0.03,
      padding: width * 0.03,
    },
    prayerInfoContainer: {
      flexDirection: "row",
      backgroundColor: "#2E7D32",
      borderRadius: 15,
      padding: width * 0.04,
      marginBottom: height * 0.02,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      marginBottom: height * 0.03,
    },
    currentPrayerContainer: {
      flex: 1,
      borderRightWidth: 1,
      borderRightColor: "rgba(255, 255, 255, 0.3)",
      paddingRight: width * 0.04,
      alignItems: "center",
      justifyContent: "center",
    },
    nextPrayerContainer: {
      flex: 1,
      paddingLeft: width * 0.04,
      alignItems: "center",
      justifyContent: "center",
    },
    prayerLabel: {
      fontSize: Math.min(width * 0.035, 14),
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: "500",
      marginBottom: 4,
    },
    prayerName: {
      fontSize: Math.min(width * 0.055, 22),
      color: "#fff",
      fontWeight: "bold",
      marginBottom: 4,
      textAlign: "center",
    },
    remainingTimeContainer: {
      position: "absolute",
      bottom: -12,
      left: 0,
      right: 0,
      alignItems: "center",
    },
    remainingTimeBox: {
      backgroundColor: "#1B5E20",
      paddingHorizontal: width * 0.04,
      paddingVertical: 6,
      borderRadius: 20,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    remainingTimeText: {
      fontSize: Math.min(width * 0.07, 14),
      color: "#fff",
      fontWeight: "600",
      textAlign: "center",
    },
    prayerTimesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: height * 0.02,
    },
    prayerTimeItem: {
      width: "16%",
      aspectRatio: 1,
      backgroundColor: "#f8f8f8",
      borderRadius: 12,
      padding: width * 0.015,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
    },
    activePrayerTimeItem: {
      backgroundColor: "#2E7D32",
    },
    prayerTimeText: {
      fontSize: Math.min(width * 0.03, 12),
      color: "#333",
      textAlign: "center",
      marginBottom: 2,
    },
    activePrayerTimeText: {
      color: "#fff",
    },
    prayerTimeValue: {
      fontSize: Math.min(width * 0.035, 14),
      fontWeight: "bold",
      color: "#2E7D32",
      textAlign: "center",
    },
    activePrayerTimeValue: {
      color: "#fff",
    },
    navigationContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: width * 0.02,
      marginBottom: height * 0.02,
    },
    navButton: {
      width: "31%",
      aspectRatio: 1,
      backgroundColor: "#f8f8f8",
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      marginBottom: height * 0.015,
    },
    navIcon: {
      width: width * 0.15,
      height: width * 0.15,
      marginBottom: 6,
    },
    navButtonText: {
      fontSize: Math.min(width * 0.05, 12),
      color: "#2E7D32",
      textAlign: "center",
    },
    cityHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f8f8f8",
      padding: width * 0.03,
      borderRadius: 12,
      marginTop: "auto",
    },
    cityNameContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    cityName: {
      fontSize: Math.min(width * 0.04, 16),
      fontWeight: "500",
      color: "#2E7D32",
      marginLeft: 8,
    },
    locationButton: {
      backgroundColor: "#2E7D32",
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.03,
      borderRadius: 8,
    },
    locationButtonText: {
      color: "#fff",
      fontSize: Math.min(width * 0.03, 12),
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.headerContainer}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.timeText}>{currentTime}</Text>
            <Text style={styles.dateText}>{gregorianDate}</Text>
            <Text style={styles.hijriDateText}>{hijriDate}</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.mainCard}>
        <View style={styles.prayerInfoContainer}>
          <View style={styles.currentPrayerContainer}>
            <Text style={styles.prayerLabel}>Şu anki vakit</Text>
            <Text style={styles.prayerName}>{nextPrayer.current}</Text>
          </View>
          <View style={styles.nextPrayerContainer}>
            <Text style={styles.prayerLabel}>Gelecek vakit</Text>
            <Text style={styles.prayerName}>{nextPrayer.name}</Text>
          </View>
          <View style={styles.remainingTimeContainer}>
            <View style={styles.remainingTimeBox}>
              <Text style={styles.remainingTimeText}>{nextPrayer.remaining} kaldı</Text>
            </View>
          </View>
        </View>

        <View style={styles.prayerTimesGrid}>
          {Object.entries(prayers).map(([name, time]) => (
            <View
              key={name}
              style={[
                styles.prayerTimeItem,
                nextPrayer.current === name && styles.activePrayerTimeItem,
              ]}
            >
              <Text
                style={[
                  styles.prayerTimeText,
                  nextPrayer.current === name && styles.activePrayerTimeText,
                ]}
              >
                {name}
              </Text>
              <Text
                style={[
                  styles.prayerTimeValue,
                  nextPrayer.current === name && styles.activePrayerTimeValue,
                ]}
              >
                {time}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.navigationContainer}>
          {[
            { name: "Takvim", icon: require("../assets/navi-calendar.png") },
            { name: "Kuran", icon: require("../assets/navi-quran.png") },
            { name: "Kıble", icon: require("../assets/navi-kible.png") },
            { name: "Hadis", icon: require("../assets/navi-hadis.png") },
            { name: "Dualar", icon: require("../assets/navi-dua.png") },
            { name: "Ayarlar", icon: require("../assets/navi-settings.png") },
          ].map((item) => (
            <Pressable
              key={item.name}
              style={styles.navButton}
              onPress={() => onNavigate(item.name)}
            >
              <Image source={item.icon} style={styles.navIcon} resizeMode="contain" />
              <Text style={styles.navButtonText}>{item.name}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.cityHeader}>
          <View style={styles.cityNameContainer}>
            <Ionicons name="location" size={20} color="#2E7D32" />
            <Text style={styles.cityName} numberOfLines={1}>
              {cityName}
            </Text>
          </View>
          <Pressable style={styles.locationButton} onPress={onLocationChange}>
            <Text style={styles.locationButtonText}>Konum Değiştir</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function Home({
  prayerTimes,
  cityName,
  hijriDate,
  onLocationChange,
  onNavigate,
}) {
  return (
    <MainScreen
      prayerTimes={prayerTimes}
      cityName={cityName}
      hijriDate={hijriDate}
      onLocationChange={onLocationChange}
      onNavigate={onNavigate}
    />
  );
}
