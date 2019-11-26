import React, { Component } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import Slider from '../Slider/Slider';
import './InfoBlock.css';

export default class InfoBlock extends Component {
    onClick = () => {
      const { sectorId, sectors, changeSectorFilter } = this.props;
      const sectorNum = R.findIndex(s => s.id === sectorId, sectors) + 1;
      if (sectorNum < sectors.length) {
        changeSectorFilter(sectors[sectorNum].id);
      } else {
        changeSectorFilter(0);
      }
    };

    render() {
      const { sectorId, sectors, infoData } = this.props;
      const mapIndexed = R.addIndex(R.map);
      const sectorNum = R.findIndex(s => s.id === sectorId, sectors) + 1;
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
              onClick={this.onClick}
            >
              <span className="info-block__info-icon">
                <svg aria-hidden="true">
                  <use xlinkHref={`${require('./images/arrow.svg')}#arrow`} />
                </svg>
              </span>
            </button>
          </div>
          <Slider numOfPositions={sectors.length} position={sectorId === 0 ? 0 : sectorNum} />
        </div>
      );
    }
}

InfoBlock.propTypes = {
  infoData: PropTypes.array,
  sectors: PropTypes.array.isRequired,
  changeSectorFilter: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
};
