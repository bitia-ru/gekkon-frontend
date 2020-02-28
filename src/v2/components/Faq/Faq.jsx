import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import InfoPageContent from '@/v1/components/InfoPageContent/InfoPageContent';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { TITLE, TITLES, FAQ_DATA } from '@/v1/Constants/Faq';
import MainScreen from '../../layouts/MainScreen/MainScreen';
import Background from './images/faq.jpg';
import { StyleSheet, css } from '../../aphrodite';

class Faq extends React.PureComponent {
  render() {
    const mapIndexed = R.addIndex(R.map);
    return (
      <MainScreen header={TITLE} styles={[styles.aboutUsHeader, styles.aboutUsHeaderTitle]}>
        <div className={css(styles.aboutUsContent)}>
          <div className={css(styles.aboutUsContentContainer)}>
            {
              mapIndexed(
                (paragraphs, index) => (
                  <React.Fragment key={index}>
                    <h2 className={css(styles.aboutUsContentTitle)}>{TITLES[index]}</h2>
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
                FAQ_DATA,
              )
            }
          </div>
        </div>
      </MainScreen>
    );
  }
}

const styles = StyleSheet.create({
  aboutUsHeader: {
    backgroundColor: '#EBEBE2',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '40vh',
    backgroundImage: `url(${Background})`,
  },
  aboutUsHeaderTitle: {
    fontSize: '100px',
    lineHeight: '1em',
    color: '#FDFDFD',
    fontWeight: 'normal',
    fontFamily: ['GilroyBold', ' sans-serif'],
    marginTop: '0',
    marginBottom: '0',
    '@media screen and (max-width: 1600px)': {
      fontSize: '70px',
      marginBottom: '60px',
    },
  },
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

Faq.propTypes = {
  titles: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(Faq));
