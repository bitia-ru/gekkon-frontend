import { StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  modalTableItemCalendar: {
    display: 'block',
    position: 'absolute',
    content: '\'\'',
    zIndex: 2,
    left: 0,
    top: 'calc(100% + 12px)',
  },
  calendar: {
    minWidth: '244px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    padding: '20px 12px 0 12px',
    backgroundColor: '#FEFEFE',
    position: 'relative',
  },
  calendarLeftBottomV2: {
    position: 'fixed',
    ':before': {
      content: '\'\'',
      position: 'absolute',
      bottom: '100%',
      left: '20px',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: '0 8px 8px 8px',
      borderColor: 'transparent transparent #ffffff transparent',
    },
  },
  calendarLeftTopV2: {
    position: 'fixed',
    ':after': {
      content: '\'\'',
      position: 'absolute',
      top: '100%',
      left: '20px',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: '8px 8px 0 8px',
      borderColor: '#ffffff transparent transparent transparent',
    },
  },
  calendarContentHeaderMonth: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    color: '#000000',
    fontFamily: ['GilroyBold', 'sans-serif'],
    paddingBottom: '14px',
    alignItems: 'center',
  },
  calendarContentHeaderButton: {
    width: '18px',
    height: '18px',
    backgroundPosition: 'center',
    backgroundSize: '8px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'opacity .3s ease-out',
    padding: 0,
    ':hover': { opacity: '.7' },
  },
  calendarContentHeaderButtonPrev: {
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%227%22%20height%3D%2211%22%20viewBox%3D%220%200%207%2011%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M0.93391%205.83524L5.31226%2010.4138C5.41353%2010.5197%205.54871%2010.5781%205.69285%2010.5781C5.83699%2010.5781%205.97217%2010.5197%206.07344%2010.4138L6.39587%2010.0767C6.60568%209.857%206.60568%209.49999%206.39587%209.28067L2.71926%205.4359L6.39995%201.58687C6.50122%201.48089%206.55713%201.33961%206.55713%201.18896C6.55713%201.03814%206.50122%200.896863%206.39995%200.790797L6.07752%200.453782C5.97617%200.347801%205.84107%200.289415%205.69693%200.289415C5.55279%200.289415%205.41761%200.347801%205.31634%200.453782L0.93391%205.03649C0.832404%205.1428%200.776652%205.28475%200.776972%205.43565C0.776652%205.58714%200.832404%205.729%200.93391%205.83524Z%22%20fill%3D%22%231F1F1F%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
  },
  calendarContentHeaderButtonNext: {
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%227%22%20height%3D%2211%22%20viewBox%3D%220%200%207%2011%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M0.93391%205.83524L5.31226%2010.4138C5.41353%2010.5197%205.54871%2010.5781%205.69285%2010.5781C5.83699%2010.5781%205.97217%2010.5197%206.07344%2010.4138L6.39587%2010.0767C6.60568%209.857%206.60568%209.49999%206.39587%209.28067L2.71926%205.4359L6.39995%201.58687C6.50122%201.48089%206.55713%201.33961%206.55713%201.18896C6.55713%201.03814%206.50122%200.896863%206.39995%200.790797L6.07752%200.453782C5.97617%200.347801%205.84107%200.289415%205.69693%200.289415C5.55279%200.289415%205.41761%200.347801%205.31634%200.453782L0.93391%205.03649C0.832404%205.1428%200.776652%205.28475%200.776972%205.43565C0.776652%205.58714%200.832404%205.729%200.93391%205.83524Z%22%20fill%3D%22%231F1F1F%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    transform: 'rotate(180deg)',
  },
  calendarContentWeekHeader: {
    display: 'flex',
    borderBottom: '1px solid #F1F2F6',
    paddingBottom: '6px',
  },
  calendarContentWeekHeaderDay: {
    width: '24px',
    height: '24px',
    marginLeft: '6px',
    marginRight: '6px',
    fontSize: '14px',
    color: '#C2C3C8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  calendarContentMonth: {
    marginTop: '12px',
    marginBottom: '12px',
  },
  calendarContentWeek: {
    display: 'flex',
    marginTop: '6px',
    marginBottom: '6px',
  },
  calendarButton: {
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
    ':after': {
      position: 'absolute',
      content: '\'\'',
      left: '12px',
      right: '12px',
      top: 0,
      height: '1px',
      backgroundColor: '#F1F2F6',
    },
    ':hover': {
      backgroundColor: '#F3F3F3',
      color: '#6F6F6F',
    },
  },
  calendarContentDay: {
    width: '24px',
    height: '24px',
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#000000',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    cursor: 'pointer',
    marginLeft: '6px',
    marginRight: '6px',
    padding: 'none',
    ':hover': { backgroundColor: '#F4F4F4' },
  },
  calendarContentDayActive: {
    backgroundColor: '#006CEB',
    color: '#ffffff',
    ':hover': { backgroundColor: '#006CEB' },
  },
  calendarContentDayCurrent: { color: '#006CEB' },
  calendarContentDayActiveDayCurrent: { color: '#ffffff' },
  calendarContentDayUnactive: {
    color: '#C2C3C8',
    ':hover': { backgroundColor: 'transparent' },
  },
});

export default styles;
