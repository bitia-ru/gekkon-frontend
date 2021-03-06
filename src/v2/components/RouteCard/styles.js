import { StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  routeCard: {
    width: '100%',
    height: '100%',
    minHeight: '350px',
    padding: '24px',
    paddingBottom: '22px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
    transition: 'box-shadow .4s ease-out',
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    ':hover': {
      boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.12)',
    },
    ':focus': {
      boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.12), 0px 0px 0px 2px rgba(0, 108, 235, 0.7)',
    },
  },
  routeCardInner: {
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    backgroundColor: '#ffffff',
  },
  routeCardImage: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%22239%22%20height%3D%22186%22%20viewBox%3D%220%200%20239%20186%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M239%20186L146%200L92.5%20107L66%2054L0%20186H53H132H239Z%22%20fill%3D%22white%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundColor: '#F3F3F3',
    overflow: 'hidden',
    position: 'relative',
    ':before': {
      display: 'block',
      width: '100%',
      paddingTop: '100%',
      content: '\'\'',
    },
  },
  routeCardImageInner: {
    position: 'absolute',
    content: '\'\'',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    '> img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  routeCardTrackStatus: {
    position: 'absolute',
    content: '\'\'',
    top: '20px',
    right: '0',
  },
  routeCardInfo: {
    paddingTop: '25px',
    backgroundColor: '#ffffff',
    '@media screen and (max-width: 1440px)': {
      paddingTop: '20px',
    },
  },
  routeCardHeader: {
    display: 'inline-flex',
    alignItems: 'baseline',
    overflow: 'hidden',
    width: '100%',
  },
  routeCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
    '@media screen and (max-width: 1440px)': {
      marginTop: '10px',
    },
  },
  routeCardNumber: {
    fontSize: '20px',
    fontFamily: ['GilroyBold', 'sans-serif'],
    color: '#1f1f1f',
    marginRight: '20px',
    lineHeight: '1.3em',
  },
  routeCardTitle: {
    fontSize: '20px',
    color: '#1f1f1f',
    marginTop: '0',
    marginBottom: '0',
    textDecoration: 'none',
    fontFamily: ['GilroyBold', 'sans-serif'],
    fontWeight: 'normal',
    whiteSpace: 'nowrap',
    width: 'auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '24px',
    lineHeight: '1.3em',
    minWidth: '0',
  },
  routeCardDate: {
    fontSize: '18px',
    color: '#B4BABC',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    lineHeight: '16px',
    flexGrow: 1,
    '@media screen and (max-width: 1440px)': {
      fontSize: '14px',
    },
  },
  routeCardDateEndSoon: {
    color: '#E24D4D',
    '> svg:first-child': {
      fill: '#E24D4D',
    },
  },
  routeCardDateIcon: {
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
    marginTop: '-1px',
    '@media screen and (max-width: 1440px)': {
      width: '16px',
      height: '16px',
      marginRight: '10px',
    },
    '> svg': {
      width: '100%',
      height: '100%',
      fill: '#D5DADC',
    },
  },
  routeCardDone: {
    opacity: '.7',
    ':hover': {
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
    },
  },
  routeAttributesWrapper: { display: 'flex' },
  routeCardCategory: {
    textAlign: 'center',
    lineHeight: '15px',
    width: '40px',
    height: '15px',
    borderStyle: 'solid',
    borderWidth: '4px',
    fontSize: '18px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    color: '#1f1f1f',
    paddingTop: '2px',
  },
  routeHoldsColor: {
    width: '25px',
    height: '25px',
    boxShadow: '0 0 1px rgba(0,0,0,0.7)',
    marginLeft: '16px',
  },
});

export default styles;
