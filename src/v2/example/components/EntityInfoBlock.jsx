import React from 'react';
import PropTypes from 'prop-types';
import EntityInfoBlockItem from '@/v2/example/components/EntityInfoBlockItem';
import { StyleSheet, css } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  infoBlockContainer: {
    display: 'flex',
    height: '110px',
    alignItems: 'center',
  },
});

const EntityInfoBlock = ({ infoBlockItems }) => (
  <div className={css(styles.infoBlockContainer)}>
    {infoBlockItems.map(item => <EntityInfoBlockItem key={item.title} item={item} />)}
  </div>
);

EntityInfoBlock.propTypes = { infoBlockItems: PropTypes.array };

export default EntityInfoBlock;
