import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Dimensions } from 'react-native';
import { commonStyles } from '../styles/CommonStyles';
import { hijriMonths } from '../constants/HijriMonths';
import ScreenHeader from '../components/ScreenHeader';

const Calendar = ({ monthlyPrayers, onBack }) => {
  const [showFullTimes, setShowFullTimes] = useState(false);
  const [formattedPrayers, setFormattedPrayers] = useState([]);

  useEffect(() => {
    if (monthlyPrayers && Array.isArray(monthlyPrayers)) {
      const formatted = monthlyPrayers.map(day => ({
        date: formatGregorianDate(day.date.gregorian.date),
        hijriDate: formatHijriDate(day.date.hijri),
        times: {
          imsak: day.timings.Fajr.split(' ')[0],
          gunes: day.timings.Sunrise.split(' ')[0],
          ogle: day.timings.Dhuhr.split(' ')[0],
          ikindi: day.timings.Asr.split(' ')[0],
          aksam: day.timings.Maghrib.split(' ')[0],
          yatsi: day.timings.Isha.split(' ')[0]
        }
      }));
      setFormattedPrayers(formatted);
    }
  }, [monthlyPrayers]);

  const formatGregorianDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long'
    });
  };

  const formatHijriDate = (hijri) => {
    return `${hijri.day} ${hijriMonths[parseInt(hijri.month.number)]}`;
  };

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    
    const today = new Date();
    const currentDate = today.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long'
    });
    
    return dateStr === currentDate;
  };

  const renderTableHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, styles.dateCell, { fontSize: 14 }]}>Tarih</Text>
      {showFullTimes ? (
        <>
          <Text style={[styles.headerCell, { fontSize: 14 }]}>İmsak</Text>
          <Text style={[styles.headerCell, { fontSize: 14 }]}>Güneş</Text>
          <Text style={[styles.headerCell, { fontSize: 14 }]}>Öğle</Text>
          <Text style={[styles.headerCell, { fontSize: 14 }]}>İkindi</Text>
          <Text style={[styles.headerCell, { fontSize: 14 }]}>Akşam</Text>
          <Text style={[styles.headerCell, { fontSize: 14 }]}>Yatsı</Text>
        </>
      ) : (
        <>
          <Text style={[styles.headerCell, { fontSize: 14 }]}>İmsak</Text>
          <Text style={[styles.headerCell, { fontSize: 14 }]}>İftar</Text>
        </>
      )}
    </View>
  );

  const renderTableRow = (day, index) => {
    if (!day || !day.times) return null;

    return (
      <View key={index} style={[styles.tableRow, isToday(day.date) && styles.todayRow]}>
        <View style={[styles.dateCellContainer, isToday(day.date) && styles.todayCell]}>
          <Text style={[styles.dateText, isToday(day.date) && styles.todayText, { fontSize: 14 }]}>
            {day.date || ''}
          </Text>
          <Text style={[styles.hijriDate, isToday(day.date) && styles.todayText, { fontSize: 12 }]}>
            {day.hijriDate || ''}
          </Text>
        </View>
        {showFullTimes ? (
          <>
            <Text style={[styles.tableCell, isToday(day.date) && styles.todayText, { fontSize: 14 }]}>{day.times.imsak || '--:--'}</Text>
            <Text style={[styles.tableCell, isToday(day.date) && styles.todayText, { fontSize: 14 }]}>{day.times.gunes || '--:--'}</Text>
            <Text style={[styles.tableCell, isToday(day.date) && styles.todayText, { fontSize: 14 }]}>{day.times.ogle || '--:--'}</Text>
            <Text style={[styles.tableCell, isToday(day.date) && styles.todayText, { fontSize: 14 }]}>{day.times.ikindi || '--:--'}</Text>
            <Text style={[styles.tableCell, isToday(day.date) && styles.todayText, { fontSize: 14 }]}>{day.times.aksam || '--:--'}</Text>
            <Text style={[styles.tableCell, isToday(day.date) && styles.todayText, { fontSize: 14 }]}>{day.times.yatsi || '--:--'}</Text>
          </>
        ) : (
          <>
            <Text style={[styles.tableCell, isToday(day.date) && styles.todayText, { fontSize: 14 }]}>{day.times.imsak || '--:--'}</Text>
            <Text style={[styles.tableCell, isToday(day.date) && styles.todayText, { fontSize: 14 }]}>{day.times.aksam || '--:--'}</Text>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScreenHeader title="Takvim" onBack={onBack} />
      <View style={styles.container}>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewButton, !showFullTimes && styles.activeViewButton]}
            onPress={() => setShowFullTimes(false)}
          >
            <Text style={[styles.viewButtonText, !showFullTimes && styles.activeViewButtonText]}>Basit Görünüm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, showFullTimes && styles.activeViewButton]}
            onPress={() => setShowFullTimes(true)}
          >
            <Text style={[styles.viewButtonText, showFullTimes && styles.activeViewButtonText]}>Detaylı Görünüm</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {renderTableHeader()}
          {formattedPrayers.length > 0 ? (
            formattedPrayers.map((day, index) => renderTableRow(day, index))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Namaz vakitleri yükleniyor...</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewToggle: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeViewButton: {
    backgroundColor: '#2E7D32',
  },
  viewButtonText: {
    color: '#2E7D32',
  },
  activeViewButtonText: {
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  dateCell: {
    flex: 2,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  todayRow: {
    backgroundColor: '#E8F5E9',
  },
  dateCellContainer: {
    flex: 2,
  },
  todayCell: {
    backgroundColor: '#2E7D32',
    borderRadius: 4,
    padding: 4,
  },
  dateText: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  todayText: {
    color: '#fff',
  },
  hijriDate: {
    color: '#666',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Calendar;