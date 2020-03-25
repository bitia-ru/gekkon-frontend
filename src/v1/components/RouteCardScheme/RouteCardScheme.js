import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Scheme from '../Scheme/Scheme';
import getArrayByIds from '../../utils/getArrayByIds';
import './RouteCardScheme.css';
import SchemePlaceholder from '@/v2/components/common/SchemePlaceholder/SchemePlaceholder';

class RouteCardScheme extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      image: undefined,
    };

    this.imagesInternal = {};
  }

  componentDidMount() {
    this.processProps(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.processProps(this.props);
    }
  }

  processProps(props) {
    if (R.has([props.src], this.imagesInternal)) {
      this.setState({ image: props.src });
      return;
    }
    this.imagesInternal[props.diagram] = new Image();
    this.imagesInternal[props.diagram].src = props.diagram;
    this.setState(
      { image: undefined },
      () => {
        this.imagesInternal[props.diagram].onload = () => {
          this.setState({ image: props.diagram });
        };
      },
    );
  }

  render() {
    const {
      onRouteClick, diagram, routeIds, routes,
    } = this.props;
    const { image } = this.state;
    return (
      <div className="hall-scheme">
        {
          image ? <Scheme
            diagram={diagram}
            onRouteClick={onRouteClick}
            currentRoutes={routeIds}
            routes={getArrayByIds(routeIds, routes)}
          />
            : <SchemePlaceholder />
        }
      </div>
    );
  }
}
RouteCardScheme.propTypes = {
  diagram: PropTypes.string,
  onRouteClick: PropTypes.func.isRequired,
  routeIds: PropTypes.array.isRequired,
  routes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  routeIds: (
    state.routesStore.filtrationResults[0]
      ? state.routesStore.filtrationResults[0].routeIds
      : []
  ),
  routes: state.routesStore.routes,
});

export default withRouter(connect(mapStateToProps)(RouteCardScheme));
