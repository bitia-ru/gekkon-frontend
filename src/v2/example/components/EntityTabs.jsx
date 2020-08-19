import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  tabsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexGrow: 1,
    minWidth: '250px',
    marginRight: '160px',
  },
  tabsItem: {
    marginTop: '110px',
    fontFamily: 'Gilroy',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '19px',
    marginLeft: '40px',
    '@media screen and (max-width: 1600px)': { fontSize: '14px' },
  },
});

const EntityTabs = ({ tabsItems }) => (
  <div className={css(styles.tabsContainer)}>
    {
      tabsItems.map(item => (
        <div
          key={item.id}
          className={css(styles.tabsItem)}
        >
          {item.text}
        </div>
      ))
    }
  </div>
);

EntityTabs.propTypes = { tabsItems: PropTypes.array };

export default EntityTabs;
