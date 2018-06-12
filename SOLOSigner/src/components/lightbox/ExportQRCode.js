import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import Lightbox from './BaseLightbox';
import QRCode from 'react-native-qrcode';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ExportQRCode = ({ data, children }) => (
  <Lightbox verticalPercent={0.5} horizontalPercent={0.9}>
    <Text>{data}</Text>
    <QRCode
      value={data}
      size={312}
      bgColor={'#fff'}
      fgColor={'#008dc2'}
    />
  </Lightbox>
);

export default ExportQRCode;
