import { useEffect, useState } from "react";
import { commonStyles } from "../styles/CommonStyles";
import ScreenHeader from "../components/ScreenHeader";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
  Pressable,
} from "react-native";

export default function HadithScreen({ onBack }) {
  const [hadiths, setHadiths] = useState([]);
  const [dailyHadith, setDailyHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Turkish and Arabic categories
      const [trResponse, arResponse] = await Promise.all([
        fetch("https://hadeethenc.com/api/v1/categories/roots/?language=tr"),
        fetch("https://hadeethenc.com/api/v1/categories/roots/?language=ar")
      ]);

      if (!trResponse.ok || !arResponse.ok) {
        throw new Error('API request failed');
      }

      const trData = await trResponse.json();
      const arData = await arResponse.json();

      console.log('TR Categories:', trData);
      console.log('AR Categories:', arData);

      // Get a random category to fetch hadiths from
      if (trData && trData.length > 0) {
        const randomCategory = trData[Math.floor(Math.random() * trData.length)];
        await fetchHadithsByCategory(randomCategory.id);
      }

    } catch (error) {
      console.error("Error details:", error);
      setError("Hadisler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      setLoading(false);
    }
  };

  const fetchHadithsByCategory = async (categoryId, page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      // Her sayfada 10 hadis getirelim
      const [trResponse, arResponse] = await Promise.all([
        fetch(`https://hadeethenc.com/api/v1/hadeeths/list/?language=tr&category_id=${categoryId}&page=${page}&per_page=10`),
        fetch(`https://hadeethenc.com/api/v1/hadeeths/list/?language=ar&category_id=${categoryId}&page=${page}&per_page=10`)
      ]);

      if (!trResponse.ok || !arResponse.ok) {
        throw new Error('Failed to fetch hadiths');
      }

      const trData = await trResponse.json();
      const arData = await arResponse.json();

      // Hadislerin detaylarını alalım
      const hadithPromises = trData.data.map(async (hadith) => {
        const [trDetail, arDetail] = await Promise.all([
          fetch(`https://hadeethenc.com/api/v1/hadeeths/one/?language=tr&id=${hadith.id}`),
          fetch(`https://hadeethenc.com/api/v1/hadeeths/one/?language=ar&id=${hadith.id}`)
        ]);

        const trHadith = await trDetail.json();
        const arHadith = await arDetail.json();

        return {
          id: hadith.id,
          title: trHadith.title,
          textTr: trHadith.hadeeth,
          textAr: arHadith.hadeeth,
          grade: trHadith.grade,
          attribution: trHadith.attribution,
          explanation: trHadith.explanation
        };
      });

      const mergedHadiths = await Promise.all(hadithPromises);

      if (page === 1) {
        if (mergedHadiths.length > 0) {
          const randomIndex = Math.floor(Math.random() * mergedHadiths.length);
          setDailyHadith(mergedHadiths[randomIndex]);
          setHadiths(mergedHadiths.filter((_, index) => index !== randomIndex));
        }
      } else {
        setHadiths(prev => [...prev, ...mergedHadiths]);
      }

      setHasMore(mergedHadiths.length === 10);
      setCurrentPage(page);

    } catch (error) {
      console.error("Error fetching hadiths:", error);
      setError("Hadisler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchHadithsByCategory(selectedCategory, currentPage + 1);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <ScreenHeader title="Hadisler" onBack={onBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Hadisler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <ScreenHeader title="Hadisler" onBack={onBack} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScreenHeader title="Hadisler" onBack={onBack} />
      
      <Pressable 
        style={styles.refreshButton}
        onPress={fetchCategories}
      >
        <Text style={styles.refreshButtonText}>Yeni Hadisler Getir</Text>
      </Pressable>

      <ScrollView 
        style={styles.container}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          
          if (isCloseToBottom) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Daily Hadith Section */}
        {dailyHadith && (
          <View style={styles.dailyHadithContainer}>
            <Text style={styles.dailyHadithTitle}>Size Özel Hadis</Text>
            <View style={styles.dailyHadithCard}>
              <Text style={styles.hadithTitle}>{dailyHadith.title}</Text>
              <Text style={styles.arabicText}>{dailyHadith.textAr}</Text>
              <Text style={styles.turkishText}>{dailyHadith.textTr}</Text>
              {dailyHadith.grade && (
                <Text style={styles.gradeText}>Derece: {dailyHadith.grade}</Text>
              )}
              {dailyHadith.attribution && (
                <Text style={styles.attributionText}>Kaynak: {dailyHadith.attribution}</Text>
              )}
            </View>
          </View>
        )}

        {/* Other Hadiths Section */}
        <View style={styles.otherHadithsContainer}>
          <Text style={styles.sectionTitle}>Diğer Hadisler</Text>
          {hadiths.map((hadith) => (
            <View key={hadith.id} style={styles.hadithCard}>
              <Text style={styles.hadithTitle}>{hadith.title}</Text>
              <Text style={styles.arabicText}>{hadith.textAr}</Text>
              <Text style={styles.turkishText}>{hadith.textTr}</Text>
              {hadith.grade && (
                <Text style={styles.gradeText}>Derece: {hadith.grade}</Text>
              )}
              {hadith.attribution && (
                <Text style={styles.attributionText}>Kaynak: {hadith.attribution}</Text>
              )}
            </View>
          ))}
          {isLoadingMore && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#2E7D32" />
              <Text style={styles.loadingMoreText}>Daha fazla hadis yükleniyor...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  dailyHadithContainer: {
    padding: 16,
    backgroundColor: '#FDF6E3',
  },
  dailyHadithTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#073642',
    textAlign: 'center',
    marginBottom: 16,
  },
  dailyHadithCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  otherHadithsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#073642',
    marginBottom: 16,
  },
  hadithCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  hadithTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#073642',
    marginBottom: 16,
    textAlign: 'center',
  },
  arabicText: {
    fontSize: 22,
    color: '#002B36',
    textAlign: 'right',
    marginBottom: 12,
    lineHeight: 36,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  turkishText: {
    fontSize: 16,
    color: '#657B83',
    lineHeight: 24,
    marginTop: 8,
  },
  gradeText: {
    fontSize: 14,
    color: '#2E7D32',
    marginTop: 8,
    fontStyle: 'italic',
  },
  attributionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  loadingMoreContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingMoreText: {
    color: '#666',
    fontSize: 14,
  },
  refreshButton: {
    backgroundColor: '#2E7D32',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});