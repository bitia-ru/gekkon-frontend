import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import News from '../News/News';
import { DEFAULT_SHOWN } from '../Constants/News';
import './NewsBlock.css';

export default class NewsBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAll: false,
    };
  }

  render() {
    const { data } = this.props;
    const { showAll } = this.state;
    return (
      <section
        className="section-news"
        style={{ backgroundImage: `url(${require('./images/mountain-peak.png')})` }}
      >
        <div className="section-news__container">
          <div className="section-news__inner">
            <div className="section-news__col-md-6 section-news__col-sm-12">
              <h2 className="section-news__title">Лента новостей</h2>
              <p className="section-news__title-descr">
                Будьте в курсе последних событий с наших скалолазных площадок
              </p>
            </div>
            <div className="section-news__col-md-6 section-news__col-sm-12">
              <div className="section-news__bar">
                {
                  R.map(
                    news => <News key={news.id} data={news} />,
                    showAll ? data : R.slice(0, DEFAULT_SHOWN, data),
                  )
                }
                {
                  !showAll && <button
                    type="button"
                    onClick={() => this.setState({ showAll: true })}
                    className="btn btn_full-length"
                  >
                    Все новости
                  </button>
                }
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }
}

NewsBlock.propTypes = {
  data: PropTypes.array.isRequired,
};
