import React from 'react';
import { StyleSheet, css } from '../../aphrodite';
import CategoryPicker from '@/v2/components/CategoryPicker/CategoryPicker';
import TryptichButtons from '@/v2/components/TriptychButtons/TriptychButtons';


const RouteAscentsLayout = ({
  title,
  blameCategory,
  categoryOpinion,
  onCategoryOpinionChanged,
  details,
}) => (
  <div className={css(style.container)}>
    <div className={css(style.titleRow)}>{title}</div>
    <div className={css(style.tryptichRow)}>
      <TryptichButtons
        buttons={[
          {
            icon: require('./assets/red_point-black.svg'),
            name: 'Red point',
            onClick() {
              console.log('red point');
            },
          },
          {
            default: true,
            icon: require('./assets/flash-white.svg'),
            name: 'Flash',
            onClick() {
              console.log('flash');
            },
          },
          {
            icon: require('./assets/attempt-black.svg'),
            name: 'Попытка',
            onClick() {
              console.log('attempt');
            },
          },
        ]}
      />
    </div>
    {
      details && details.show && (
        <div
          className={css(style.expander, details && details.expanded && style.expanderActivated)}
          onClick={
            () => {
              if (details && typeof details.onExpand === 'function') {
                details.onExpand();
              }
            }
          }
        >
          Подробнее <img src={require('./assets/expander_flag.svg')} />
        </div>
      )
    }
    {
      details && details.expanded && (
        <table className={css(style.table)}>
          <thead>
            <tr>
              <th style={{width: "10%", textAlign: 'left'}}>№</th>
              <th style={{width: "25%"}}>Статус</th>
              <th style={{width: "45%", textAlign: 'left'}}>Дата</th>
              <th style={{width: "20%"}} />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{width: "10%"}}>1</td>
              <td style={{width: "25%", textAlign: 'center'}}><img src={require('./assets/fail.svg')} /></td>
              <td style={{width: "45%"}}>26.01.2020</td>
              <td style={{width: "20%", textAlign: 'right'}}><img src={require('./assets/remove.svg')} /></td>
            </tr>
            <tr>
              <td style={{width: "10%"}}>2</td>
              <td style={{width: "25%", textAlign: 'center'}}><img src={require('./assets/success.svg')} /></td>
              <td style={{width: "45%"}}>26.01.2020</td>
              <td style={{width: "20%", textAlign: 'right'}}><img src={require('./assets/remove.svg')} /></td>
            </tr>
          </tbody>
        </table>
      )
    }
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
  tryptichRow: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  categoryBlameRow: {
    color: '#006CEB',

    ':hover': {
      cursor: 'pointer',
      color: '#005eb9',
      backgroundColor: 'rgba(0,0,0,0.02)',
    },
  },
  expander: {
    color: '#919191',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '12px',

    '> img': {
      verticalAlign: 'middle',
      transform: 'rotate(180deg)',
    },

    ':hover': {
      color: '#878787',
    },
    ':active': {
      color: '#787878',
    },
  },
  expanderActivated: {
    '> img': {
      transform: 'rotate(0deg)',
    },
  },
  table: {
    width: '100%',
  },
});

export default RouteAscentsLayout;
