import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GymBasicInfoBlock from '@/v2/components/GymBasicInfoBlock/GymBasicInfoBlock';
import { loadSpot as loadSpotAction } from '../../redux/spots/actions';
import { loadSpecificUser as loadSpecificUserAction } from '../../redux/users/actions';
import MainScreen from '../../layouts/MainScreen/MainScreen';
import { css, StyleSheet } from '@/v2/aphrodite';

const DEMO_MODERATOR_ID = 2;

const GymBasicInfoBlockExample = ({ loadSpot, loadSpecificUser, match }) => {
  const loadData = () => {
    loadSpot(match.params.id);
    loadSpecificUser(DEMO_MODERATOR_ID);
  };

  useEffect(() => loadData(), []);

  return (
    <MainScreen>
      <div className={css(styles.container)}>
        <GymBasicInfoBlock id={match.params.id} />
      </div>
    </MainScreen>
  );
};

const styles = StyleSheet.create({ container: { margin: '100px 50px 50px 50px' } });

GymBasicInfoBlockExample.propTypes = {
  loadSpot: PropTypes.func,
  loadSpecificUser: PropTypes.func,
  match: PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
  loadSpot: id => dispatch(loadSpotAction(id)),
  loadSpecificUser: id => dispatch(loadSpecificUserAction(id)),
});

export default connect(null, mapDispatchToProps)(GymBasicInfoBlockExample);
