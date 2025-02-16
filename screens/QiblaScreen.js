import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer, Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { commonStyles } from '../styles/CommonStyles';

const MECCA_COORDS = {
  latitude: 21.422487,
  longitude: 39.826206
};

export default function QiblaScreen({ onBack }) {
  const [location, setLocation] = useState(null);
  const [qiblaAngle, setQiblaAngle] = useState(null);
  const [magnetometer, setMagnetometer] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isStable, setIsStable] = useState(false);
  const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 });
  const [accelerometerSubscription, setAccelerometerSubscription] = useState(null);

  useEffect(() => {
    _subscribe();
    _subscribeToAccelerometer();
    getLocationPermission();
    return () => {
      _unsubscribe();
      _unsubscribeFromAccelerometer();
    };
  }, []);

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener(data => {
        let angle = Math.atan2(data.y, data.x);
        angle = (angle * (180 / Math.PI) + 360) % 360;
        setMagnetometer(angle);
      })
    );
    Magnetometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const _subscribeToAccelerometer = () => {
    setAccelerometerSubscription(
      Accelerometer.addListener(data => {
        setAccelerometer(data);
        checkDeviceStability(data);
      })
    );
    Accelerometer.setUpdateInterval(500);
  };

  const _unsubscribeFromAccelerometer = () => {
    accelerometerSubscription && accelerometerSubscription.remove();
    setAccelerometerSubscription(null);
  };

  const checkDeviceStability = (data) => {
    // Telefon yatay düzlemde ve hareketsiz mi kontrol et
    const isFlat = Math.abs(data.z) > 0.8 && Math.abs(data.x) < 0.2 && Math.abs(data.y) < 0.2;
    const isStable = isFlat;
    setIsStable(isStable);
  };

  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Konum izni gereklidir');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      calculateQiblaAngle(location.coords);
    } catch (error) {
      setErrorMsg('Konum alınamadı');
    }
  };

  const calculateQiblaAngle = (coords) => {
    const lat1 = coords.latitude * (Math.PI / 180);
    const lon1 = coords.longitude * (Math.PI / 180);
    const lat2 = MECCA_COORDS.latitude * (Math.PI / 180);
    const lon2 = MECCA_COORDS.longitude * (Math.PI / 180);

    const y = Math.sin(lon2 - lon1);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lon2 - lon1);
    let qiblaAngle = Math.atan2(y, x) * (180 / Math.PI);
    
    qiblaAngle = (qiblaAngle + 360) % 360;
    setQiblaAngle(qiblaAngle);
  };

  const getRotationAngle = () => {
    if (qiblaAngle === null || magnetometer === null) return '0deg';
    const rotation = (qiblaAngle - magnetometer + 360) % 360;
    return `${rotation}deg`;
  };

  if (errorMsg) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <ScreenHeader title="Kıble" onBack={onBack} />
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <Text style={styles.errorSubText}>
              Kıble yönünü gösterebilmek için konum iznine ihtiyacımız var.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScreenHeader title="Kıble" onBack={onBack} />
      <View style={styles.container}>
        <View style={[
          styles.compassContainer,
          !isStable && styles.compassContainerUnstable
        ]}>
          <View style={styles.compassCircle}>
            <View style={styles.compassInnerCircle} />
            <View style={styles.compassOuterRing} />
            <View style={styles.compassMarkers}>
              {[...Array(72)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.marker,
                    { transform: [{ rotate: `${i * 5}deg` }] },
                    i % 18 === 0 ? styles.markerLarge : null
                  ]}
                />
              ))}
            </View>
          </View>
          
          <View style={[styles.arrowContainer, { transform: [{ rotate: getRotationAngle() }] }]}>
            <View style={styles.arrowLine} />
            <View style={styles.arrowHead} />
            <View style={styles.arrowCircle}>
              <Ionicons name="location" size={32} color="#2E7D32" />
            </View>
            <Text style={styles.arrowText}>KIBLE</Text>
          </View>

          <View style={styles.directionLabels}>
            <Text style={styles.directionText}>KUZEY</Text>
            <View style={styles.eastWestContainer}>
              <Text style={styles.directionText}>BATI</Text>
              <Text style={styles.directionText}>DOĞU</Text>
            </View>
            <Text style={styles.directionText}>GÜNEY</Text>
          </View>
        </View>

        <View style={styles.stabilityContainer}>
          <Ionicons 
            name={isStable ? "checkmark-circle" : "warning"} 
            size={24} 
            color={isStable ? "#2E7D32" : "#FFA000"} 
          />
          <Text style={[
            styles.stabilityText,
            isStable ? styles.stabilityTextStable : styles.stabilityTextUnstable
          ]}>
            {isStable 
              ? "Telefon sabit, kıble yönü doğru gösteriliyor" 
              : "Telefonu düz bir zemine koyun ve sabit tutun"}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color="#2E7D32" />
            <Text style={styles.infoTitle}>Nasıl Kullanılır?</Text>
          </View>
          <View style={styles.infoBox}>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>1</Text>
              <Text style={styles.infoText}>Telefonu düz tutun</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>2</Text>
              <Text style={styles.infoText}>Yeşil ok Kıble yönünü gösterir</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>3</Text>
              <Text style={styles.infoText}>Pusula kalibrasyonu için telefonu 8 şeklinde hareket ettirin</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>4</Text>
              <Text style={styles.infoText}>
                Kıble açısı: {qiblaAngle ? Math.round(qiblaAngle) : '--'}°{'\n'}
                (Not: Bulunduğunuz konuma göre açı değişebilir)
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassContainer: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: COMPASS_SIZE / 2,
    backgroundColor: '#f8f8f8',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  compassCircle: {
    width: COMPASS_SIZE - 40,
    height: COMPASS_SIZE - 40,
    borderRadius: (COMPASS_SIZE - 40) / 2,
    borderWidth: 2,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  compassInnerCircle: {
    width: COMPASS_SIZE - 120,
    height: COMPASS_SIZE - 120,
    borderRadius: (COMPASS_SIZE - 120) / 2,
    borderWidth: 1,
    borderColor: '#2E7D32',
    position: 'absolute',
  },
  compassOuterRing: {
    width: COMPASS_SIZE - 80,
    height: COMPASS_SIZE - 80,
    borderRadius: (COMPASS_SIZE - 80) / 2,
    borderWidth: 1,
    borderColor: '#2E7D32',
    position: 'absolute',
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
  },
  arrowLine: {
    width: 8,
    height: COMPASS_SIZE - 60,
    backgroundColor: '#2E7D32',
    position: 'absolute',
    top: 30,
  },
  arrowHead: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 50,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#2E7D32',
    position: 'absolute',
    top: -20,
    transform: [{ rotate: '180deg' }],
  },
  arrowCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#2E7D32',
    position: 'absolute',
    top: COMPASS_SIZE / 2 - 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#2E7D32',
    fontSize: 22,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 30,
  },
  directionLabels: {
    position: 'absolute',
    width: COMPASS_SIZE - 20,
    height: COMPASS_SIZE - 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  directionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  eastWestContainer: {
    width: COMPASS_SIZE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  infoContainer: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  infoNumber: {
    backgroundColor: '#2E7D32',
    color: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  compassMarkers: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: '#2E7D32',
    left: '50%',
    top: 0,
    marginLeft: -1,
  },
  markerLarge: {
    height: 20,
    width: 3,
    backgroundColor: '#1B5E20',
  },
  compassContainerUnstable: {
    opacity: 0.7,
  },
  stabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  stabilityText: {
    fontSize: 16,
    flex: 1,
  },
  stabilityTextStable: {
    color: '#2E7D32',
  },
  stabilityTextUnstable: {
    color: '#FFA000',
  },
});