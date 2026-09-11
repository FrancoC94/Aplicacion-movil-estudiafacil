import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../utils/colors';

const SkeletonTarea = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.priority, { opacity }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.title, { opacity }]} />
        <Animated.View style={[styles.desc, { opacity }]} />
        <Animated.View style={[styles.descShort, { opacity }]} />
        <View style={styles.footer}>
          <Animated.View style={[styles.date, { opacity }]} />
          <Animated.View style={[styles.badge, { opacity }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    height: 120,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.outline + '10',
  },
  priority: {
    width: 6,
    backgroundColor: colors.surfaceVariant,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    height: 20,
    width: '60%',
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    marginBottom: 12,
  },
  desc: {
    height: 14,
    width: '90%',
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    marginBottom: 8,
  },
  descShort: {
    height: 14,
    width: '40%',
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    height: 12,
    width: '30%',
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
  },
  badge: {
    height: 20,
    width: 60,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 8,
  },
});

export default SkeletonTarea;
