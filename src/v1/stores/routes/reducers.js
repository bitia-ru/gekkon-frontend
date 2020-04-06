import * as R from 'ramda';
import * as acts from './constants/actions';
import DEFAULT_STORE_FORMAT from './constants/defaultStoreFormat';

const routesStoreReducer = (
  state = DEFAULT_STORE_FORMAT,
  action,
) => {
  switch (action.type) {
  case acts.LOAD_ROUTES_REQUEST:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests + 1,
    };
  case acts.LOAD_ROUTES_FAILED:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOAD_FILTRATION_RESULTS:
    return {
      ...state,
      filtrationResults: {
        ...state.filtrationResults,
        [action.filtersKey]: action.filtrationResults,
      },
    };
  case acts.LOAD_ROUTE_SUCCESS:
    return {
      ...state,
      routes: {
        ...state.routes,
        [action.route.id]: action.route,
      },
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOAD_ROUTES_SUCCESS:
    return {
      ...state,
      routes: R.mergeDeepRight(
        state.routes,
        R.fromPairs(R.map(route => [route.id, route], action.routes)),
      ),
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOAD_ROUTE_DATA_SUCCESS:
    return {
      ...state,
      routes: R.mergeDeepRight(
        state.routes,
        { [action.routeId]: action.routeData },
      ),
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOAD_ROUTE_PROPERTY_SUCCESS:
    return {
      ...state,
      routes: R.mergeDeepRight(
        state.routes,
        {
          [action.routeId]: {
            [action.routePropertyName]: {
              [action.routPropertyData.id]: action.routePropertyData,
            },
          },
        },
      ),
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.REMOVE_ROUTE_PROPERTY_BY_ID_SUCCESS:
    return {
      ...state,
      routes: R.dissocPath(
        [`${action.routeId}`, action.routePropertyName, `${action.routePropertyId}`],
        state.routes,
      ),
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.REMOVE_ROUTE_SUCCESS:
    return {
      ...state,
      routes: R.dissoc(action.routeId, stateCopy.routes),
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  default:
    return state;
  }
};

export default routesStoreReducer;
