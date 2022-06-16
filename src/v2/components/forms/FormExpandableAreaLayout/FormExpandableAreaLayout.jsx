import React from 'react';
import { css, StyleSheet } from '../../../aphrodite';


const FormExpandableAreaLayout = ({ children, expanded, onClick }) => (
  <>
    <div
      className={css(style.expander, expanded && style.expanderActivated)}
      onClick={() => onClick && onClick()}
    >
      Подробнее <img src={require('./assets/expander_flag.svg').default} />
    </div>
    {
      expanded && children
    }
  </>
);

const style = StyleSheet.create({
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
});


export default FormExpandableAreaLayout;
