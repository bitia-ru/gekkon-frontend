import { StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  cropperContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    width: '100%',
    backgroundColor: '#000000',
    height: '100%',
  },
  cropperWrapper: {
    zIndex: 200,
    height: '100%',
  },
  cropper: {
    height: '100%',
    '> img': { maxHeight: '100%' },
  },
});

export default styles;
