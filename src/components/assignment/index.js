import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

const AssignmentItem = ({navigation, Assignment, index}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Learning', {
          learn: Assignment.id,
          name: Assignment.title,
        });
      }}>
      <View style={styles.outerView}>
        <View style={styles.chapterItemMain}>
          <Text
            style={{
              fontFamily: 'Nunito-Regular',
              fontSize: 12,
              lineHeight: 18,
              color: '#00420C',
            }}>
            {index + 1}
          </Text>
        </View>
        <View style={styles.textSection}>
          <Text numberOfLines={2} style={styles.chapterItemTitle}>
            {Assignment.title}
          </Text>
        </View>
        <View>
          <Image
            style={styles.ChapterItemDownload}
            source={require('../../assets/images/chevron-right.png')}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  outerView: {
    borderWidth: 0.6,
    borderColor: '#00420C',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  textSection: {
    flex: 1,
    paddingHorizontal: 12,
  },
  chapterItemMain: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00420C',
    borderRadius: 24,
    width: 24,
    height: 24,
  },
  chapterItemTitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    lineHeight: 20,
    color: '#00420C',
    marginBottom: 4,
  },
  chapterItemDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  chapterItemDetailClock: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  Clock: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  ClockText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    lineHeight: 18,
    color: '#6B7586',
  },
  ChapterItemDetailLessons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ChapterItemDetailLessonsText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    lineHeight: 18,
    color: '#6B7586',
  },
  ChapterItemDownload: {
    width: 20,
    height: 20,
  },
});
export default AssignmentItem;
