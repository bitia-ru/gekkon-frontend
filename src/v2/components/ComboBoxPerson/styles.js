import {StyleSheet} from '../../aphrodite';

const styles = StyleSheet.create({
  comboBoxContainer: {
    outline: 'none',
    position: 'relative',
  },
  comboBoxButton: {
    lineHeight: '1.3em',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 0,
    padding: '16px 40px 16px 20px',
    backgroundColor: '#ffffff',
    outline: 'none',
    fontFamily: 'GilroyRegular',
    boxSizing: 'border-box',
    position: 'relative',
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    border: '2px solid transparent',
    transition: 'box-shadow .4s ease-out, border .4s ease-out',
    height: '29px',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '7px',
    paddingRight: '16px',
    width: 'auto',
    cursor: 'pointer',
    fontSize: '16px',
    '@media screen and (max-width: 1440px)': {
      fontSize: '14px',
    },
    ':before': {
      position: 'absolute',
      content: '\'\'',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2214%22%20height%3D%229%22%20viewBox%3D%220%200%2014%209%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M7%209L0.0717972%20-1.30507e-06L13.9282%20-9.36995e-08L7%209Z%22%20fill%3D%22%231A1A1A%22/%3E%0A%3C/svg%3E%0A")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% auto',
      pointerEvents: 'none',
      zIndex: 2,
      opacity: 0,
      transition: 'opacity .4s ease-out',
      width: '6px',
      height: '4px',
      right: '5px',
    },
    ':after': {
      height: '100%',
      backgroundColor: '#ffffff',
      position: 'absolute',
      content: '\'\'',
      right: 0,
      top: 0,
      zIndex: 1,
      width: '15px',
    },
    ':hover': {
      border: '2px solid #DDE2EF',
      ':before': {
        opacity: 1,
      },
    },
    ':focus': {
      border: '2px solid #DDE2EF',
      ':before': {
        opacity: 1,
      },
    },
  },
  comboBoxDropdown: {
    content: '\'\'',
    position: 'absolute',
    margin: 0,
    padding: 0,
    left: 0,
    top: 'calc(100% + 20px)',
    backgroundColor: '#ffffff',
    minWidth: '100%',
    boxSizing: 'border-box',
    boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.12)',
    border: '2px solid #DDE2EF',
    zIndex: 10,
    display: 'block',
  },
  comboBoxSearchWrapper: {
    position: 'relative',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      left: '10px',
      right: '10px',
      bottom: 0,
      height: '1px',
      backgroundColor: '#EBEBEB',
    },
  },
  comboBoxSearch: {
    border: 'none',
    width: '100%',
    height: '36px',
    fontSize: '14px',
    fontFamily: 'GilroyRegular, sans-serif',
    color: '#1f1f1f',
    outline: 'none',
    paddingLeft: '38px',
    paddingRight: '10px',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2215%22%20height%3D%2214%22%20viewBox%3D%220%200%2015%2014%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M5.8559%200C2.62136%200%200%202.6243%200%205.86062C0%209.09693%202.62136%2011.7212%205.8559%2011.7212C7.51722%2011.7212%209.01678%2011.0289%2010.0825%209.91698L13.7874%2013.6252L14.4942%2012.9178L10.7139%209.13409C11.344%208.19932%2011.7118%207.07291%2011.7118%205.86062C11.7118%202.6243%209.09043%200%205.8559%200ZM1%205.86062C1%203.17576%203.17447%201%205.8559%201C8.53732%201%2010.7118%203.17576%2010.7118%205.86062C10.7118%208.54548%208.53732%2010.7212%205.8559%2010.7212C3.17447%2010.7212%201%208.54548%201%205.86062Z%22%20fill%3D%22%23828282%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '14px 14px',
    backgroundPosition: '11px 10px',
    boxSizing: 'border-box',
  },
  comboBoxDropdownWrapper: {
    maxHeight: '270px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
  },
  comboBoxDropdownItem: {
    listStyle: 'none',
    lineHeight: '1.3em',
    color: '#1f1f1f',
    fontFamily: 'GilroyRegular',
    fontSize: '18px',
    maxWidth: '100%',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    padding: '10px',
    ':hover': {
      backgroundColor: '#f5f5f5',
      cursor: 'pointer',
    },
  },
  comboBoxDropdownItemSelected: {
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
  },
  clearButton: {
    color: '#C2C3C8',
    fontSize: '14px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'background-color .3s ease-out, color .3s ease-out',
    position: 'relative',
    outline: 'none',
    ':after': {
      position: 'absolute',
      content: '\'\'',
      left: 0,
      right: 0,
      top: 0,
      height: '1px',
      backgroundColor: '#F1F2F6',
    },
    ':hover': {
      backgroundColor: '#F3F3F3',
      color: '#6F6F6F',
    },
  },
});

export default styles;
