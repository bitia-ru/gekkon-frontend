import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import RouteCardView from '../RouteCardView/RouteCardView';
import FilterBlock from '../FilterBlock/FilterBlock';
import Pagination from '../Pagination/Pagination';
import SectorContext from '../../contexts/SectorContext';
import getNumOfPages from '../../utils/getNumOfPages';
import './Content.css';
import {
  setSelectedPage,
} from '../../actions';
import { reloadRoutes as reloadRoutesAction } from '../../utils/reloadRoutes';
import getViewMode from '../../utils/getViewMode';
import getPage from '../../utils/getPage';
import { ApiUrl } from '@/v1/Environ';
import toastHttpError from '@/v2/utils/toastHttpError';

const NUM_OF_DISPLAYED_PAGES = 5;

class Content extends Component {
  componentDidMount() {
    this.props.reloadRoutes(this.getSpotId(), this.getSectorId());
  }

  componentDidUpdate(prevProps) {
    if (this.needReload(prevProps)) {
      this.props.reloadRoutes(this.getSpotId(), this.getSectorId());
    }
  }

  needReload = (prevProps) => {
    const {
      selectedFilters,
      selectedViewModes,
      selectedPages,
      match,
    } = this.props;
    if (!R.equals(selectedFilters, prevProps.selectedFilters)) {
      return true;
    }
    if (!R.equals(selectedViewModes, prevProps.selectedViewModes)) {
      return true;
    }
    if (!R.equals(selectedPages, prevProps.selectedPages)) {
      return true;
    }
    if (!R.equals(match.url, prevProps.match.url)) {
      return true;
    }
    return false;
  };

  getSpotId = () => {
    const { match } = this.props;
    return parseInt(match.params.id, 10);
  };

  getSectorId = () => {
    const { match } = this.props;
    return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
  };

  onRouteClick = (id) => {
    const { history, match } = this.props;
    history.push(`${match.url}/routes/${id}`);
  };

  changePage = (page) => {
    const {
      setSelectedPage: setSelectedPageProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    setSelectedPageProp(spotId, sectorId, page);
  };

  pagesList = () => {
    const { selectedPages, numOfPages } = this.props;
    const page = getPage(selectedPages, this.getSpotId(), this.getSectorId());
    if (NUM_OF_DISPLAYED_PAGES >= numOfPages) {
      return R.range(1, numOfPages + 1);
    }
    const firstPage = page - Math.floor(NUM_OF_DISPLAYED_PAGES / 2);
    const lastPage = firstPage + NUM_OF_DISPLAYED_PAGES;
    if (firstPage >= 1 && lastPage <= numOfPages) {
      return R.range(firstPage, lastPage);
    }
    if (firstPage >= 1) {
      return R.range(numOfPages - NUM_OF_DISPLAYED_PAGES + 1, numOfPages + 1);
    }
    return R.range(1, NUM_OF_DISPLAYED_PAGES + 1);
  };

  addRoute = () => { this.props.history.push(`${this.props.match.url}/routes/new`); };

  onDropFiles = (acceptedFiles) => {
    const data = new FormData();
    data.append('wall_photo[photo]', acceptedFiles[0]);
    data.append('wall_photo[sector_id]', this.getSectorId());

    Axios({
      url: `${ApiUrl}/v1/wall_photos`,
      method: 'post',
      data,
      config: { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true },
    })
      .then(() => {
        if (acceptedFiles.length > 1) {
          this.onDropFiles(R.slice(1, Infinity, acceptedFiles));
        }
      }).catch((error) => {
        toastHttpError(error);
      });
  };

  render() {
    const {
      numOfPages,
      sectors,
      selectedViewModes,
      selectedPages,
    } = this.props;
    const page = getPage(selectedPages, this.getSpotId(), this.getSectorId());
    const viewMode = getViewMode(
      sectors,
      selectedViewModes,
      this.getSpotId(),
      this.getSectorId(),
    );
    return (
      <SectorContext.Consumer>
        {
          ({ sector }) => {
            const diagram = sector && sector.diagram && sector.diagram.url;
            return (
              <div className="content">
                <Dropzone onDrop={this.onDropFiles}>
                  {({ getRootProps, getInputProps }) => (
                    <div className="content__container" {...getRootProps()} onClick={(event) => event.stopPropagation()}>
                      <input {...getInputProps()} />
                      <FilterBlock
                        viewMode={viewMode}
                        viewModeData={
                          sector
                            ? {
                              scheme: {
                                title: diagram ? undefined : 'Схема зала ещё не загружена',
                                disabled: diagram === null,
                              },
                              table: {},
                              list: {},
                            }
                            : {
                              table: {},
                              list: {},
                            }
                        }
                      />
                      <RouteCardView
                        viewMode={viewMode}
                        addRoute={this.addRoute}
                        diagram={diagram}
                        onRouteClick={this.onRouteClick}
                      />
                      {
                        viewMode !== 'scheme' && <Pagination
                          onPageChange={this.changePage}
                          page={page}
                          pagesList={this.pagesList()}
                          firstPage={1}
                          lastPage={numOfPages}
                        />
                      }
                    </div>
                  )}
                </Dropzone>
              </div>
            );
          }
        }
      </SectorContext.Consumer>
    );
  }
}

Content.propTypes = {
  diagram: PropTypes.string,
  numOfPages: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  numOfPages: getNumOfPages(state),
  sectors: state.sectorsStore.sectors,
  selectedViewModes: state.selectedViewModes,
  selectedPages: state.selectedPages,
  selectedFilters: state.selectedFilters,
});

const mapDispatchToProps = dispatch => ({
  reloadRoutes: (spotId, sectorId) => dispatch(reloadRoutesAction(spotId, sectorId)),
  setSelectedPage: (spotId, sectorId, page) => dispatch(setSelectedPage(spotId, sectorId, page)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Content));
