import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteCard from '../RouteCard/RouteCard';
import { HIDE_DELAY } from '../../Constants/Scheme';
import SchemePointer from '../SchemePointer/SchemePointer';
import SectorContext from '../../contexts/SectorContext';
import './Scheme.css';

class Scheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shownRouteId: null,
      imageIsLoading: true,
    };
  }

  showRouteCard = (id) => {
    this.setState({ shownRouteId: id });
  };

  hideCard = () => {
    this.TimerId = setTimeout(() => this.setState({ shownRouteId: null }), HIDE_DELAY);
  };

  render() {
    const {
      sectors,
      onRouteClick,
      showCards,
      currentRoutes,
    } = this.props;
    const { shownRouteId, imageIsLoading } = this.state;
    const position = (left, top) => {
      const dist = [left, top, 100 - left, 100 - top];
      const maxIndex = R.findIndex(e => e === R.sort((a, b) => b - a, dist)[0], dist);
      return ['left', 'top', 'right', 'bottom'][maxIndex];
    };
    return (
      <SectorContext.Consumer>
        {
          ({ sector }) => {
            const currentSector = (
              currentRoutes.length > 0
                ? sectors[currentRoutes[0].sector_id]
                : sector
            );
            const diagram = currentSector && currentSector.diagram && currentSector.diagram.url;
            return (
              <>
                {
                  diagram && <>
                    <img
                      onLoad={() => this.setState({ imageIsLoading: false })}
                      style={{ visibility: imageIsLoading ? 'hidden' : 'visible' }}
                      src={diagram}
                      alt=""
                    />
                    {
                      !imageIsLoading && R.map(
                        route => (
                          <React.Fragment key={route.id}>
                            {
                              route.data && route.data.position && <div
                                className="hall-scheme__track"
                                style={{
                                  left: `${route.data.position.left}%`,
                                  top: `${route.data.position.top}%`,
                                }}
                              >
                                <SchemePointer
                                  onClick={() => onRouteClick(route.id)}
                                  onMouseEnter={() => this.showRouteCard(route.id)}
                                  onMouseLeave={this.hideCard}
                                  category={route.category}
                                  color={
                                    route.holds_color === null ? undefined : route.holds_color.color
                                  }
                                />
                                {
                                  (showCards && route.id === shownRouteId) && <div
                                    role="button"
                                    tabIndex={0}
                                    style={{ outline: 'none' }}
                                    onMouseEnter={() => clearTimeout(this.TimerId)}
                                    onMouseLeave={() => this.setState({ shownRouteId: null })}
                                    onClick={() => onRouteClick(route.id)}
                                    className={
                                      `track-point__tooltip track-point__tooltip_${
                                        position(
                                          route.data.position.left,
                                          route.data.position.top,
                                        )
                                      }`
                                    }
                                  >
                                    <RouteCard route={route} />
                                  </div>
                                }
                              </div>
                            }
                          </React.Fragment>),
                        currentRoutes,
                      )
                    }
                  </>
                }
              </>
            );
          }
        }
      </SectorContext.Consumer>
    );
  }
}

Scheme.propTypes = {
  onRouteClick: PropTypes.func,
  currentRoutes: PropTypes.array.isRequired,
  showCards: PropTypes.bool,
  sectors: PropTypes.object.isRequired,
};

Scheme.defaultProps = {
  onRouteClick: null,
  showCards: true,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
});

export default withRouter(connect(mapStateToProps)(Scheme));
