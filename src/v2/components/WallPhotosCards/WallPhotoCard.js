import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';
import './WallCard.css';


class WallPhotoCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageIsLoading: true,
    };
  }

  style = StyleSheet.create({
    imageContainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%22239%22%20height%3D%22186%22%20viewBox%3D%220%200%20239%20186%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M239%20186L146%200L92.5%20107L66%2054L0%20186H53H132H239Z%22%20fill%3D%22white%22/%3E%0A%3C/svg%3E%0A")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundColor: '#F3F3F3',
      overflow: 'hidden',
      position: 'relative',
    },
  });

  render() {
    const { photo } = this.props;
    const { imageIsLoading } = this.state;
    return (
      <a className="route_photo-card">
        <article className="route-card__inner">
          <div className={css(this.style.imageContainer)}>
            <div className="route-card__image-inner">
              {
                photo && (
                  <img
                    src={photo.photo.thumb_url}
                    onLoad={() => this.setState({ imageIsLoading: false })}
                    style={{ visibility: imageIsLoading ? 'hidden' : 'visible' }}
                  />
                )
              }
            </div>
          </div>
        </article>
      </a>
    );
  }
}


WallPhotoCard.propTypes = {
  photo: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
});

export default withRouter(connect(mapStateToProps)(WallPhotoCard));
