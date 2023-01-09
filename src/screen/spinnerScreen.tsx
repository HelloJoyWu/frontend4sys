import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export const SpinnerScreen: React.FC<{}> = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000000',
      }}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
