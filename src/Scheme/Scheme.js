import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteCard from '../RouteCard/RouteCard';
import { HIDE_DELAY } from '../Constants/Scheme';
import SchemePointer from '../SchemePointer/SchemePointer';
import './Scheme.css';

export default class Scheme extends Component {
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
      diagram,
      onRouteClick,
      routes,
      ascents,
      showCards,
    } = this.props;
    const { shownRouteId, imageIsLoading } = this.state;
    const position = (left, top) => {
      const dist = [left, top, 100 - left, 100 - top];
      const maxIndex = R.findIndex(e => e === R.sort((a, b) => b - a, dist)[0], dist);
      return ['left', 'top', 'right', 'bottom'][maxIndex];
    };
    return (<>
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
                        color={route.holds_color === null ? undefined : route.holds_color.color}
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
                          <RouteCard
                            ascent={R.find(ascent => ascent.route_id === route.id, ascents)}
                            route={route}
                          />
                        </div>
                      }
                    </div>
                  }
                </React.Fragment>),
              routes,
            )
          }
        </>
      }
    </>);
  }
}

Scheme.propTypes = {
  diagram: PropTypes.string,
  onRouteClick: PropTypes.func,
  routes: PropTypes.array,
  ascents: PropTypes.array,
  showCards: PropTypes.bool,
};

Scheme.defaultProps = {
  onRouteClick: null,
  routes: [],
  ascents: [],
  showCards: true,
};
