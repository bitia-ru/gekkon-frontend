import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import Pagination from '@/v1/components/Pagination/Pagination';
import { StyleSheet, css } from '../../aphrodite';
import { ApiUrl } from '@/v1/Environ';
import WallPhotosCardsLayout from './WallPhotosCardsLayout';
import { loadWallPhotos as loadWallPhotosAction } from '../../redux/wall_photos/actions';
import toastHttpError from '@/v2/utils/toastHttpError';


class WallPhotosCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
    };
  }

  componentDidMount() {
    this.props.loadWallPhotos(this.getSectorId());
  }

  getSectorId = () => parseInt(R.propOr(0, 'sector_id', this.props.match.params), 10);

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
        this.props.loadWallPhotos(this.getSectorId());

        if (acceptedFiles.length > 1) {
          this.onDropFiles(R.slice(1, Infinity, acceptedFiles));
        }
      }).catch((error) => {
        toastHttpError(error);
      });
  };

  style = StyleSheet.create({
    container: {
      paddingTop: '105px',
      paddingBottom: '105px',

      '@media screen and (max-width: 1440px)': {
        paddingTop: '65px',
        paddingBottom: '65px',
      },
    },
  });

  obtainWallPhotos = () => {
    const { page } = this.state;

    return R.sort((a, b) => b.id - a.id)(Object.values(this.props.wallPhotos));
  };

  render() {
    return (
      <Dropzone onDrop={this.onDropFiles}>
        {({ getRootProps, getInputProps }) => (
          <div
            className={css(this.style.container)}
            {...getRootProps()}
            onClick={(event) => event.stopPropagation()}
          >
            <input {...getInputProps(this.getSectorId())} />
            <WallPhotosCardsLayout photos={this.obtainWallPhotos()} />
            <Pagination
              onPageChange={page => this.setState({ page })}
              page={this.state.page}
              pagesList={[1, 2, 3, 4, 5, 6, 7]}
              firstPage={1}
              lastPage={6}
            />
          </div>
        )}
      </Dropzone>
    );
  }
}

WallPhotosCards.propTypes = {
};

const mapStateToProps = state => ({
  wallPhotos: state.wallPhotosV2,
});

const mapDispatchToProps = dispatch => ({
  loadWallPhotos: (sectorId) => dispatch(loadWallPhotosAction(sectorId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WallPhotosCards));
