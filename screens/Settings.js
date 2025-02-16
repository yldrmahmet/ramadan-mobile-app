import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { commonStyles } from '../styles/CommonStyles';
import ScreenHeader from '../components/ScreenHeader';

export default function Settings({ onLocationChange, onBack }) {
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScreenHeader title="Ayarlar" onBack={onBack} />
      <View style={styles.container}>
        <Pressable 
          style={styles.settingItem}
          onPress={onLocationChange}
        >
          <Text style={styles.settingText}>Konum Değiştir</Text>
          <Text style={styles.settingDescription}>
            Şehrinizi değiştirmek için dokunun
          </Text>
        </Pressable>

        <View style={styles.developersSection}>
          <Text style={styles.sectionTitle}>Geliştiriciler</Text>
          <View style={styles.settingItem}>
            <Text style={styles.developerName}>Ahmet Yıldırım</Text>
            <Text style={styles.developerName}>Emre Baran Arca</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingItem: {
    ...commonStyles.mainCard,
    marginBottom: 16,
  },
  settingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  developersSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2E7D32',
    marginBottom: 12,
  },
  developerName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  }
}); 