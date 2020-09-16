import { StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  kind: {
    fontSize: '20px',
    lineHeight: '23px',
    color: '#7F7F7F',
  },
  signUpContainer: { display: 'none' },
  bell: {
    height: '23px',
    width: '20px',
    '> svg': {
      width: '100%',
      height: '100%',
      fill: '#c4c4c4',
    },
  },
  signUp: {
    marginLeft: 12,
    fontSize: '20px',
    lineHeight: '23px',
    color: '#293034',
  },
  leftBlock: { width: '55%' },
  rightBlock: {
    width: '45%',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 74,
  },
  topBlock: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  gymName: {
    marginTop: 27,
    fontWeight: 500,
    fontSize: '48px',
    lineHeight: '58px',
    fontFamily: 'GilroyMedium',
  },
  btnContainer: {
    marginTop: 34,
    width: '100%',
  },
  arrow: {
    height: '10px',
    width: '20px',
    marginLeft: '10px',
    '> svg': {
      width: '100%',
      height: '100%',
      fill: '#f1f1f1',
    },
  },
  bottomBlock: { marginTop: 50 },
  gymInfoTopBlock: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  moderatorBlock: { display: 'flex' },
  moderatorInfo: {
    marginLeft: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  moderatorName: {
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
    color: '#293034',
  },
  writeModeratorLink: {
    fontSize: '20px',
    lineHeight: '24px',
    color: '#006CEB',
    cursor: 'pointer',
    marginTop: 11,
  },
  infoBlock: {
    display: 'flex',
    alignItems: 'center',
  },
  routesInfo: { marginLeft: 51 },
  gymInfoBtnBlock: {
    marginTop: 50,
    display: 'flex',
  },
  btnWrapper: { flex: 1 },
  gymInfoDescBlock: { marginTop: 60 },
  gymInfoDescHeader: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '20px',
    lineHeight: '25px',
    display: 'flex',
    alignItems: 'center',
    color: '#293034',
    fontFamily: 'GilroyBold',
  },
  gymInfoDescContent: {
    fontWeight: 300,
    fontSize: '16px',
    lineHeight: '18px',
    color: '#000000',
    marginTop: 22,
  },
});

export default styles;
