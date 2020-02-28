import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const InfoPageContent = ({ titles, data }) => {
  const mapIndexed = R.addIndex(R.map);
  return (
    <div className={css(styles.aboutUsContent)}>
      <div className={css(styles.aboutUsContentContainer)}>
        {
          mapIndexed(
            (paragraphs, index) => (
              <React.Fragment key={index}>
                <h2 className={css(styles.aboutUsContentTitle)}>{titles[index]}</h2>
                {
                  mapIndexed(
                    (paragraph, i) => (
                      <p key={i} className={css(styles.aboutUsContentText)}>
                        {paragraph}
                      </p>
                    ),
                    paragraphs,
                  )
                }
              </React.Fragment>
            ),
            data,
          )
        }
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  aboutUsContent: {
    paddingTop: '75px',
    paddingBottom: '75px',
  },
  aboutUsContentContainer: {
    width: '100%',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  aboutUsContentTitle: {
    fontSize: '34px',
    marginBottom: '40px',
    marginTop: '0',
    fontFamily: ['GilroyBold', 'sans-serif'],
    maxWidth: '380px',
    lineHeight: '42px',
    color: '#1F1F1F',
  },
  aboutUsContentText: {
    fontSize: '18px',
    lineHeight: '32px',
    marginBottom: '28px',
    marginTop: '28px',
    color: '#1f1f1f',
  },
});

InfoPageContent.propTypes = {
  titles: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default InfoPageContent;
