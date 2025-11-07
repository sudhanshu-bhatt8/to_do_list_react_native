import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../style/colors';

type Props = { title: string; date?: string };

export default function TaskItem({ title, date }: Props) {
  return (
    <TouchableOpacity style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {date && <Text style={styles.date}>{date}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 12,
  },
});
