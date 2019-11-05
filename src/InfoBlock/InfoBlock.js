import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import Slider from '../Slider/Slider';
import getArrayByIds from '../../v1/utils/getArrayByIds';
import SectorContext from '../contexts/SectorContext';
import './InfoBlock.css';

class InfoBlock extends Component {
    onClick = (sectorId) => {
      const {
        sectors,
        changeSectorFilter,
        sectorIds,
      } = this.props;
      const currentSectors = getArrayByIds(sectorIds, sectors);
      const sectorNum = R.findIndex(s => s.id === sectorId, currentSectors) + 1;
      if (sectorNum < currentSectors.length) {
        changeSectorFilter(currentSectors[sectorNum].id);
      } else {
        changeSectorFilter(0);
      }
    };

    render() {
      const {
        sectors,
        infoData,
        sectorIds,
      } = this.props;
      const currentSectors = getArrayByIds(sectorIds, sectors);
      const mapIndexed = R.addIndex(R.map);
      return (
        <SectorContext.Consumer>
          {
            ({ sector }) => {
              const sectorNum = R.findIndex(
                s => s.id === (sector ? sector.id : undefined),
                currentSectors,
              ) + 1;
              return (
                <div className="info-block__bottom">
                  <div className="info-block__info">
                    <div className="info-block__info-inner">
                      {
                        infoData && (
                          <>
                            {mapIndexed((el, index) => (
                              <div key={index} className="info-block__info-item">
                                <div className="info-block">
                                  <div className="info-block__number">
                                    {el.count}
                                  </div>
                                  <p className="info-block__descr">
                                    {el.label}
                                  </p>
                                </div>
                              </div>
                            ), infoData)}
                          </>
                        )
                      }
                    </div>
                    <button
                      className="info-block__info-button"
                      type="button"
                      onClick={() => this.onClick(sector ? sector.id : 0)}
                    >
                      <span className="info-block__info-icon">
                        <svg aria-hidden="true">
                          <use xlinkHref={`${require('./images/arrow.svg')}#arrow`} />
                        </svg>
                      </span>
                    </button>
                  </div>
                  <Slider
                    numOfPositions={currentSectors.length}
                    position={sector === undefined ? 0 : sectorNum}
                  />
                </div>
              );
            }
          }
        </SectorContext.Consumer>
      );
    }
}

InfoBlock.propTypes = {
  infoData: PropTypes.array,
  sectors: PropTypes.object.isRequired,
  sectorIds: PropTypes.array.isRequired,
  changeSectorFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  sectors: state.sectors,
  sectorIds: state.sectorIds,
});

export default withRouter(connect(mapStateToProps)(InfoBlock));
