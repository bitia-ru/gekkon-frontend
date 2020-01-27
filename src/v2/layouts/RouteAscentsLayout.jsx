import React from 'react';
import { StyleSheet, css } from '../aphrodite';
import CategoryPicker from '@/v2/components/CategoryPicker/CategoryPicker';


const RouteAscentsLayout = ({
  title,
  blameCategory,
  categoryOpinion,
  onCategoryOpinionChanged
}) => (
  <div className={css(style.container)}>
    <div className={css(style.titleRow)}>{title}</div>
    <div className={css(style.buttonsRow)}>блок кнопок</div>
    <div className={css(style.categoryBlameRow)}>
    {
      blameCategory
        ? <>
          {'Моя оценка: '}
          <CategoryPicker
            category={categoryOpinion}
            changeCategory={
              category => onCategoryOpinionChanged(category)
            }
          />
        </>
        : 'Не согласен с категорией!'
    }
    </div>
  </div>
);

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
  },
  titleRow: {
    fontFamily: 'GilroyBold, sans-serif',
    fontSize: '24px',
    marginBottom: '20px',
  },
  buttonsRow: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  categoryBlameRow: {
    color: '#006CEB',

    ':hover': {
      cursor: 'pointer',
      color: '#005eb9',
      backgroundColor: 'rgba(0,0,0,0.02)',
    },
  },
});

export default RouteAscentsLayout;
