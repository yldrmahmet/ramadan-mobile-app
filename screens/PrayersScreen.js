import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import { commonStyles } from "../styles/CommonStyles";
import { prayerCategories, prayers } from "../constants/PrayerData";

export default function PrayersScreen({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState(1); // Varsayılan olarak Namaz kategorisi
  const [categoryPrayers, setCategoryPrayers] = useState(prayers[1]); // Varsayılan duaları yükle
  const [sound, setSound] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setCategoryPrayers(prayers[categoryId] || []);
  };

  const playAudio = async (audioUrl, prayerId) => {
    try {
      if (playingId === prayerId) {
        await sound?.stopAsync();
        setPlayingId(null);
        return;
      }

      if (sound) {
        await sound.unloadAsync();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(audioUrl);
      await newSound.playAsync();

      setSound(newSound);
      setPlayingId(prayerId);

      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          setPlayingId(null);
        }
      });
    } catch (error) {
      console.error("Ses oynatma hatası:", error);
      Alert.alert("Hata", "Ses dosyası oynatılamadı");
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const renderPrayerCard = ({ item }) => (
    <View
      style={[styles.prayerCard, playingId === item.id && styles.playingCard]}
    >
      <View style={styles.prayerHeader}>
        <Text
          style={[
            styles.prayerName,
            playingId === item.id && styles.playingText,
          ]}
        >
          {item.name}
        </Text>
        {item.audioUrl && (
          <Pressable
            style={styles.audioButton}
            onPress={() => playAudio(item.audioUrl, item.id)}
          >
            <Ionicons
              name={playingId === item.id ? "pause-circle" : "play-circle"}
              size={32}
              color={playingId === item.id ? "#1B5E20" : "#2E7D32"}
            />
          </Pressable>
        )}
      </View>
      <Text style={styles.arabicText}>{item.arabic}</Text>
      <Text
        style={[
          styles.turkishText,
          playingId === item.id && styles.playingText,
        ]}
      >
        {item.turkish}
      </Text>
      <Text
        style={[
          styles.meaningText,
          playingId === item.id && styles.playingText,
        ]}
      >
        {item.meaning}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScreenHeader title="Dualar" onBack={onBack} />
      <View style={styles.container}>
        <View style={styles.categoryContainer}>
          {prayerCategories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategory === category.id && styles.selectedCategory,
              ]}
              onPress={() => selectCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryTitle,
                  selectedCategory === category.id && styles.selectedCategoryTitle,
                ]}
              >
                {category.title}
              </Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={categoryPrayers}
          renderItem={renderPrayerCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.prayerList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  categoryContainer: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryCard: {
    flex: 1, // Eşit genişlik için
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedCategory: {
    backgroundColor: "#e8f5e9",
    borderColor: "#2E7D32",
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666", // Tüm kategoriler için aynı renk
  },
  selectedCategoryTitle: {
    color: "#2E7D32", // Sadece seçili kategori için farklı renk
  },
  prayerList: {
    padding: 16,
  },
  prayerCard: {
    ...commonStyles.mainCard,
    padding: 16,
    marginBottom: 16,
  },
  prayerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  audioButton: {
    padding: 4,
  },
  arabicText: {
    fontSize: 22,
    color: "#333",
    textAlign: "right",
    marginBottom: 12,
    lineHeight: 36,
  },
  turkishText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    lineHeight: 24,
  },
  meaningText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 20,
  },
  playingCard: {
    backgroundColor: "#E8F5E9",
    borderColor: "#2E7D32",
    borderWidth: 1,
    shadowColor: "#2E7D32",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playingText: {
    color: "#1B5E20",
  },
});
