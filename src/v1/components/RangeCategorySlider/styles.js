import { StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  rangeCategoryBlock: {
    outline: 'none',
    position: 'relative',
  },
  rangeCategoryContainer: {
    width: '100%',
    height: '56px',
    lineHeight: '1.3em',
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #DDE2EF',
    borderRadius: 0,
    padding: '16px 40px 16px 20px',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'box-shadow .4s ease-out',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    fontSize: '18px',
    boxSizing: 'border-box',
    position: 'relative',
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    '@media screen and (max-width: 1440px)': { fontSize: '16px' },
  },
  rangeCategoryContainerActive: { boxShadow: '0px 0px 0px 2px rgba(0, 108, 235, 0.7)' },
  rangeCategoryDropdown: {
    content: '\'\'',
    position: 'absolute',
    margin: 0,
    left: 0,
    top: 'calc(100% + 20px)',
    backgroundColor: '#ffffff',
    minWidth: '100%',
    boxSizing: 'border-box',
    boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.12)',
    border: '2px solid #DDE2EF',
    zIndex: 10,
  },
  rangeCategorySlider: {
    content: '\'\'',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '28px',
    width: '316px',
    height: '133px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.12)',
    zIndex: 10,
    position: 'relative',
  },
  rangeCategoryActive: { display: 'flex' },
  rangeCategories: {
    display: 'flex',
    flex: '1 0 auto',
  },
  categorySliderContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '32px',
  },
  categorySliderRuler: {
    height: '20px',
    width: 'calc(100% + 20px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categorySliderRulerItem: {
    fontSize: '12px',
    lineHeight: '14px',
    color: '#000',
    fontFamily: ['GilroyRegular, sans-serif'],
  },
  categorySliderRulerItemFirst: { marginBottom: 'auto' },
  categorySliderRulerItemLast: { marginTop: 'auto' },
  categorySliderBar: {
    height: '5px',
    width: '100%',
    border: '2px solid #DDE2EF',
    background: 'linear-gradient(90deg, #FFFFFF 0.02%, #FFE602 14.8%, #48FF66 28.92%, #7C81FF 45.91%, #EB002A 71.82%, #141414 92.81%)',
    position: 'relative',
  },
  categorySliderBarHandler: {
    position: 'absolute',
    content: '\'\'',
    width: '9px',
    height: '20px',
    top: 'calc(100% + 4px)',
    bottom: '-5px',
    backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOSIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDkgMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00LjUgMS40OTQ4NUw4IDUuMzgzNzRMOCAxOUwwLjk5OTk5OSAxOUwxIDUuMzgzNzRMNC41IDEuNDk0ODVaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMDA2Q0VCIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg==")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
  },
  categorySliderBarItem: {
    position: 'absolute',
    width: '2px',
    height: '13px',
    backgroundColor: '#DDE2EF',
    top: '-7px',
  },
  categorySliderBarItemFirst: { left: '-2px' },
  categorySliderBarItemMiddle: { left: '48.5%' },
  categorySliderBarItemLast: { right: '-2px' },

});

export default styles;
