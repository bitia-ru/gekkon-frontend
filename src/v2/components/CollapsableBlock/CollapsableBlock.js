import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const CollapsableBlock = ({
  title, text, isCollapsed, onCollapseChange,
}) => (
  <div>
    <button
      onClick={() => onCollapseChange(!isCollapsed)}
      type="button"
      className={css(styles.collapsableBlockHeader,
        isCollapsed
          ? ''
          : styles.collapsableBlockHeaderActive)
      }
    >
      {title}
    </button>
    <React.Fragment>
      {
        isCollapsed
          ? ''
          : (
            <div className={css(styles.collapsableBlockContent)}>
              {text}
            </div>
          )
      }
    </React.Fragment>
  </div>
);

const styles = StyleSheet.create({
  collapsableBlockHeader: {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    outline: 'none',
    padding: '0',
    width: '100%',
    textAlign: 'left',
    position: 'relative',
    paddingRight: '15px',
    cursor: 'pointer',
    fontSize: '22px',
    color: '#1f1f1f',
    fontFamily: 'GilroyBold',
    lineHeight: '1.3em',
    '@media screen and (max-width: 1440px)': {
      fontSize: '18px',
    },
    ':after': {
      position: 'absolute',
      content: '\'\'',
      display: 'block',
      width: '10px',
      height: '7px',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%228%22%20viewBox%3D%220%200%2010%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M5%207.1875L-6.01031e-08%202.1875L1.3125%200.8125L5%204.5L8.6875%200.8125L10%202.1875L5%207.1875Z%22%20fill%3D%22%231F1F1F%22/%3E%0A%3C/svg%3E%0A")',
      backgroundRepeat: 'no-repeat',
      right: '0px',
      top: '12px',
      '@media screen and (max-width: 1440px)': {
        top: '7px',
      },
    },
  },
  collapsableBlockHeaderActive: {
    ':after': {
      transform: 'rotate(180deg)',
    },
  },
  collapsableBlockHeaderEdit: {
    cursor: 'default',
    ':after': {
      display: 'none',
    },
  },
  collapsableBlockContent: {
    color: '#1f1f1f',
    fontSize: '16px',
    lineHeight: '1.3em',
    marginTop: '15px',
    maxHeight: '150px',
    overflowY: 'auto',
    '@media screen and (max-width: 1440px)': {
      fontSize: '14px',
      marginTop: '8px',
    },
  },
});

CollapsableBlock.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  onCollapseChange: PropTypes.func.isRequired,
};

export default CollapsableBlock;
