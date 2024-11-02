// Libs
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';

/**
 * Course Item
 */
const DepartmentCard = ({navigation, dep}) => {
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Details', {
          Department: dep.id,
          name: dep.name,
        });
      }}>
      <View style={styles.courseItem}>
        <View
          style={{
            paddingVertical: 12,
            paddingLeft: 12,
            paddingRight: 35,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}>
          <Text numberOfLines={3} style={styles.courseTitle}>
            {dep.name}
          </Text>

          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <Text style={styles.courseSubTitle}>
              {dep.chapters_count > 1
                ? dep.chapters_count + ' chapters'
                : dep.chapters_count + ' chapter'}
            </Text>
            <Text style={styles.courseSubTitle}>{dep.time}</Text>
          </View> */}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  courseItem: {
    width: (Dimensions.get('window').width - 3 * 16) / 2,
    height: 140,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00420C',
    borderRadius: 4,
  },
  courseTitle: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    lineHeight: 18,
    color: '#121415',
    marginRight: 4,
    width: '90%',
  },
  courseSubTitle: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    lineHeight: 18,
    color: '#6B7586',
    marginRight: 4,
  },
  statusMessageText: {
    fontSize: 12,
    fontFamily: 'Nunito-Italic',
    lineHeight: 18,
    color: '#121415',
    marginLeft: 2,
  },
});

export default DepartmentCard;
