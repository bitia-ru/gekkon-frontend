import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  entityInfoBlockItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxHeight: '110px',
    fontFamily: 'GilroyRegular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '19px',
    '@media screen and (max-width: 1600px)': { fontSize: '14px' },
  },
  entityInfoBlockItemTitle: {
    display: 'flex',
    alignItems: 'center',
    height: '55px',
    color: '#BCC2C3',
    marginTop: '15px',
  },
  entityInfoBlockItemValue: {
    display: 'flex',
    alignItems: 'center',
    height: '55px',
    color: '#293034',
    marginBottom: '15px',
  },
});

const EntityInfoBlockItem = ({ item }) => (
  <div className={css(styles.entityInfoBlockItemContainer)}>
    <div className={css(styles.entityInfoBlockItemTitle)}>{item.title}</div>
    <div className={css(styles.entityInfoBlockItemValue)}>{item.value}</div>
  </div>
);

EntityInfoBlockItem.propTypes = { item: PropTypes.object };

export default EntityInfoBlockItem;
