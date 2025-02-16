import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Pressable,
  Alert,
  Platform
} from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { commonStyles } from '../styles/CommonStyles';
import { Ionicons } from '@expo/vector-icons';
import { surahNames } from '../constants/SurahNames';
import ScreenHeader from '../components/ScreenHeader';

const Quran = ({ onBack }) => {
  // Temel state'ler
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [surahVerses, setSurahVerses] = useState([]);
  const [versesLoading, setVersesLoading] = useState(false);
  const [reciterModalVisible, setReciterModalVisible] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState(20);

  // Ses ile ilgili state'ler
  const [selectedReciter, setSelectedReciter] = useState('ar.mahermuaiqly');
  const [currentVerse, setCurrentVerse] = useState(null);
  const [sound, setSound] = useState(null);
  // En üstte state'lerin yanına ekleyin
  const isPlayingAllRef = useRef(false);

  // Hafız listesi
  const [reciters] = useState([
    { id: 'ar.mahermuaiqly', name: 'Mahir El-Muaykli' },
    { id: 'ar.alafasy', name: 'El-Afasi' },
    { id: 'ar.minshawi', name: 'El-Minşevi' },
  ]);

  // Referanslar
  const flatListRef = useRef(null);
  const audioController = useRef({
    sound: null
  });

  // State'lere tümünü oynat için ekleme yapalım
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0);

  // Yeni state ekleyelim
  const [currentSurahIndex, setCurrentSurahIndex] = useState(0);

  // useEffect cleanup'ını da güncelleyin
  useEffect(() => {
    fetchSurahs();
    return () => {
      isPlayingAllRef.current = false;
      cleanupAudio();
    };
  }, []);

  // cleanupAudio fonksiyonunu da güncelleyin
  const cleanupAudio = async () => {
    try {
      if (sound) {
        try {
          await sound.stopAsync();
        } catch (e) { }
        try {
          await sound.unloadAsync();
        } catch (e) { }
        setSound(null);
      }
      setCurrentVerse(null);
    } catch (error) {
      console.error('Ses temizleme hatası:', error);
    }
  };

  const playAllVerses = async () => {
    if (isPlayingAllRef.current) {
      isPlayingAllRef.current = false;
      setIsPlayingAll(false);
      await cleanupAudio();
      return;
    }

    if (!selectedSurah || !surahVerses.length) {
      Alert.alert('Hata', 'Lütfen bir sure seçin.');
      return;
    }

    isPlayingAllRef.current = true;
    setIsPlayingAll(true);

    try {
      for (let verse of surahVerses) {
        if (!isPlayingAllRef.current) break;
  
        await cleanupAudio();
  
        const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${verse.number}.mp3`;
        
        console.log(`Playing verse ${verse.number} from surah ${selectedSurah.number}`);
  
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true }
        );
  
        setSound(newSound);
        setCurrentVerse(verse.numberInSurah);
        
        // Ayete scroll yap
        scrollToVerse(verse.numberInSurah);
  
        await new Promise((resolve) => {
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              resolve();
            }
          });
        });
      }
    } catch (error) {
      console.error('Ses çalma hatası:', error);
      Alert.alert('Hata', 'Ses çalma sırasında bir hata oluştu.');
    } finally {
      isPlayingAllRef.current = false;
      setIsPlayingAll(false);
      await cleanupAudio();
    }
  };

  const playVerse = async (verseNumber) => {
    try {
      // Eğer bu ayet şu an çalıyorsa, durdur
      if (currentVerse === verseNumber) {
        isPlayingAllRef.current = false;
        setIsPlayingAll(false);
        await cleanupAudio();
        return;
      }
  
      // Eğer tümünü oynat modundaysa, onu durdur
      if (isPlayingAllRef.current) {
        isPlayingAllRef.current = false;
        setIsPlayingAll(false);
      }
  
      await cleanupAudio();
      
      const verse = surahVerses.find(v => v.numberInSurah === verseNumber);
      if (!verse) return;
  
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${verse.number}.mp3`;
      
      console.log('Playing URL:', audioUrl);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
  
      setSound(newSound);
      setCurrentVerse(verseNumber);
      
      scrollToVerse(verseNumber);
  
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          cleanupAudio();
        }
      });
  
    } catch (error) {
      console.error('Ses çalma hatası:', error);
    }
  };

  // API istekleri
  const fetchSurahs = async () => {
    try {
      const response = await axios.get('https://api.alquran.cloud/v1/surah');
      setSurahs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Sureler yüklenirken hata:', error);
      Alert.alert('Hata', 'Sureler yüklenirken bir sorun oluştu.');
      setLoading(false);
    }
  };

  // fetchSurahVerses fonksiyonunu güncelleyelim
  const fetchSurahVerses = async (surahNumber) => {
    try {
      setVersesLoading(true);
      // Yeni sure seçildiğinde ses çalmayı durdur ve state'leri sıfırla
      isPlayingAllRef.current = false;
      setIsPlayingAll(false);
      await cleanupAudio();

      const [arabicResponse, translationResponse] = await Promise.all([
        axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
        axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/tr.diyanet`)
      ]);

      const verses = arabicResponse.data.data.ayahs.map((ayah, index) => ({
        ...ayah,
        translation: translationResponse.data.data.ayahs[index].text
      }));

      setSurahVerses(verses);
      setVersesLoading(false);
    } catch (error) {
      console.error('Ayetler yüklenirken hata:', error);
      Alert.alert('Hata', 'Ayetler yüklenirken bir sorun oluştu.');
      setVersesLoading(false);
    }
  };

  // Ses kontrol fonksiyonları
  const handleReciterChange = async (reciterId) => {
    await cleanupAudio();
    setSelectedReciter(reciterId);
    setReciterModalVisible(false);
  };

  // Render fonksiyonları
  const renderSurahItem = ({ item }) => (
    <TouchableOpacity
      style={styles.surahCard}
      onPress={() => {
        setSelectedSurah(item);
        setIsModalVisible(true);
        fetchSurahVerses(item.number);
      }}
    >
      <View style={styles.surahInfo}>
        <View style={styles.surahNumberContainer}>
          <Text style={styles.surahNumber}>{item.number}</Text>
        </View>
        <View style={styles.surahDetails}>
          <Text style={styles.surahName}>{surahNames[item.number]}</Text>
          <Text style={styles.surahSubtitle}>
            {item.name} • {item.numberOfAyahs} Ayet
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // renderVerse fonksiyonunu güncelleyelim
  const renderVerse = ({ item }) => (
    <View style={[
      styles.verseContainer,
      currentVerse === item.numberInSurah && styles.activeVerse
    ]}>
      <View style={styles.verseHeader}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => playVerse(item.numberInSurah)}
        >
          <Ionicons
            name={currentVerse === item.numberInSurah ? "stop-circle" : "play-circle"}
            size={32}
            color="#2E7D32"
          />
        </TouchableOpacity>
        <Text style={styles.verseNumber}>{item.numberInSurah}</Text>
      </View>
      <Text style={[styles.verseText, { fontSize }]}>{item.text}</Text>
      {showTranslation && (
        <Text style={[styles.translationText, { fontSize: fontSize * 0.8 }]}>
          {item.translation}
        </Text>
      )}
    </View>
  );


  // playVerse ve playAllVerses fonksiyonlarında scroll işlemini ekleyelim
  const scrollToVerse = (verseNumber) => {
    const index = surahVerses.findIndex(v => v.numberInSurah === verseNumber);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.3 // 0.3 ayeti ekranın üst kısmına yakın konumlandırır
      });
    }
  };


  const ReciterModal = () => (
    <Modal
      visible={reciterModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setReciterModalVisible(false)}
    >
      <View style={styles.reciterModalContainer}>
        <View style={styles.reciterModalContent}>
          <View style={styles.reciterModalHeader}>
            <Text style={styles.reciterModalTitle}>Hafız Seçimi</Text>
            <Pressable
              onPress={() => setReciterModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#2E7D32" />
            </Pressable>
          </View>
          {reciters.map((reciter) => (
            <Pressable
              key={reciter.id}
              style={[
                styles.reciterItem,
                selectedReciter === reciter.id && styles.selectedReciter
              ]}
              onPress={() => handleReciterChange(reciter.id)}
            >
              <Text style={[
                styles.reciterName,
                selectedReciter === reciter.id && styles.selectedReciterText
              ]}>
                {reciter.name}
              </Text>
              {selectedReciter === reciter.id && (
                <Ionicons name="checkmark" size={24} color="#2E7D32" />
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );

  const renderModalHeader = () => (
    <View style={styles.modalHeader}>
      <View style={styles.modalNavigation}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setIsModalVisible(false);
            cleanupAudio();
          }}
        >
          <Ionicons name="close" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.modalTitle}>
          {surahNames[selectedSurah?.number]}
        </Text>
        <Text style={styles.arabicTitle}>
          {selectedSurah?.name}
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.playAllButton}
            onPress={playAllVerses}
          >
            <Ionicons
              name={isPlayingAll ? "stop-circle" : "play-circle"}
              size={24}
              color="#fff"
            />
            <Text style={styles.playAllButtonText}>
              {isPlayingAll ? 'Durdur' : 'Tümünü Oynat'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reciterButton}
            onPress={() => setReciterModalVisible(true)}
          >
            <Ionicons name="person" size={20} color="#2E7D32" />
            <Text style={styles.buttonText}>{reciters.find(r => r.id === selectedReciter)?.name}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlRow}>
          <View style={styles.fontControls}>
            <TouchableOpacity
              style={styles.fontButton}
              onPress={() => setFontSize(prev => Math.max(16, prev - 2))}
            >
              <Ionicons name="remove-circle-outline" size={24} color="#2E7D32" />
            </TouchableOpacity>
            <Text style={styles.buttonText}>{fontSize}</Text>
            <TouchableOpacity
              style={styles.fontButton}
              onPress={() => setFontSize(prev => Math.min(32, prev + 2))}
            >
              <Ionicons name="add-circle-outline" size={24} color="#2E7D32" />
            </TouchableOpacity>
          </View>

          <View style={styles.translationToggle}>
            <Pressable
              style={[styles.checkbox, showTranslation && styles.checkboxChecked]}
              onPress={() => setShowTranslation(!showTranslation)}
            >
              {showTranslation && <Ionicons name="checkmark" size={16} color="#fff" />}
            </Pressable>
            <Text style={styles.buttonText}>Meal</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.mainHeader}>
      <Text style={commonStyles.pageTitle}>Kuran-ı Kerim</Text>
      <TouchableOpacity
        style={styles.mainReciterButton}
        onPress={() => setReciterModalVisible(true)}
      >
        <Ionicons name="person" size={24} color="#2E7D32" />
        <Text style={styles.reciterButtonText}>Hafız Seç</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <ScreenHeader title="Kuran-ı Kerim" onBack={onBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScreenHeader title="Kuran-ı Kerim" onBack={onBack} />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2E7D32" />
          </View>
        ) : (
          <FlatList
            data={surahs}
            renderItem={renderSurahItem}
            keyExtractor={item => item.number.toString()}
          />
        )}
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setIsModalVisible(false);
          cleanupAudio();
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          {renderModalHeader()}

          {versesLoading ? (
            <ActivityIndicator size="large" color="#2E7D32" />
          ) : (
            <FlatList
              data={surahVerses}
              renderItem={renderVerse}
              keyExtractor={item => item.numberInSurah.toString()}
              contentContainerStyle={styles.versesContainer}
              ref={flatListRef}
              onScrollToIndexFailed={info => {
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                  flatListRef.current?.scrollToIndex({
                    index: currentVerse ? surahVerses.findIndex(v => v.numberInSurah === currentVerse) : 0,
                    animated: true,
                    viewPosition: 0.5
                  });
                });
              }}
            />
          )}
        </SafeAreaView>
      </Modal>
      <ReciterModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 16,
  },
  modalNavigation: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f7f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  arabicTitle: {
    fontSize: 18,
    color: '#666',
  },
  controlsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  playAllButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    gap: 8,
    marginRight: 8,
  },
  reciterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f7f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    gap: 8,
  },
  fontControls: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f7f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    marginRight: 8,
  },
  fontButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  translationToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f7f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2E7D32',
  },
  buttonText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  playAllButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  surahCard: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 12,
  },
  surahInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f7f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  surahNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  surahDetails: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  surahSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  verseContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verseNumber: {
    fontSize: 14,
    color: '#666',
  },
  verseText: {
    fontSize: 20,
    lineHeight: 36,
    textAlign: 'right',
    fontFamily: 'me_quran',
    color: '#000',
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginTop: 8,
  },
  reciterModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  reciterModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '70%',
  },
  reciterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reciterModalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  reciterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedReciter: {
    backgroundColor: '#e8f5e9',
  },
  reciterName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  selectedReciterText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  mainReciterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7f0',
    padding: 8,
    borderRadius: 20,
    gap: 4,
  },
  reciterButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  verseContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activeVerse: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
});

export default Quran;
