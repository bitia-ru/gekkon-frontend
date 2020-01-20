import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import News from '../News/News';
import { DEFAULT_DAYS_SHOWN, DAYS_STEP } from '../../Constants/News';
import './NewsBlock.css';
import { loadNews } from '@/v1/stores/news/utils';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class NewsBlock extends Component {
  constructor(props) {
    super(props);

    const date = new Date();
    date.setHours(12, 0, 0, 0);
    const dateTo = new Date(date);
    const dateFrom = new Date(dateTo);
    dateFrom.setDate(dateTo.getDate() - DEFAULT_DAYS_SHOWN);
    this.state = {
      dateFrom: dateFrom,
      dateTo: dateTo,
    };
  }

  componentDidMount() {
    const { dateFrom, dateTo } = this.state;
    console.log(dateTo);
    this.loadNews(dateFrom, dateTo);
  }

  loadMoreNews = () => {
    const { dateFrom } = this.state;
    const dateFromNew = new Date(dateFrom);
    dateFromNew.setDate(dateFrom.getDate() - DAYS_STEP);
    const dateToNew = new Date(dateFrom);
    dateToNew.setDate(dateFrom.getDate() - 1);
    this.setState({ dateFrom: dateFromNew });
    this.loadNews(dateFromNew, dateToNew);
  };

  loadNews = (dateFrom, dateTo) => {
    const { loadNews: loadNewsProp } = this.props;
    const params = { group_by: 'day', filters: { date: [[dateFrom], [dateTo]] } };
    loadNewsProp(params);
  };

  filteredNews = (dateFrom, dateTo) => {
    const { news: newsProp } = this.props;
    const filteredNews = R.pick(
      R.filter(
        (dateStr) => {
          const [day, month, year] = dateStr.split('.');
          const date = new Date(year, month - 1, day, 12);
          return date >= dateFrom && date <= dateTo;
        },
        R.keys(newsProp),
      ),
      newsProp,
    );
    return R.flatten(R.values(filteredNews));
  };

  showMoreNewsButton = () => {
    const { dateFrom } = this.state;
    const dateTo = new Date(dateFrom);
    dateTo.setDate(dateFrom.getDate() + DAYS_STEP - 1);
    return this.filteredNews(dateFrom, dateTo).length > 0;
  };

  render() {
    const mapIndexed = R.addIndex(R.map);
    const { dateFrom, dateTo } = this.state;
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
                  mapIndexed(
                    (news, index) => <News key={index} data={news} />,
                    this.filteredNews(dateFrom, dateTo),
                  )
                }
                {
                  this.showMoreNewsButton() && <button
                    type="button"
                    onClick={this.loadMoreNews}
                    className="btn btn_full-length"
                  >
                    Еще новости
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
  news: PropTypes.object,
};

const mapStateToProps = state => ({
  news: state.newsStore.news,
});

const mapDispatchToProps = dispatch => ({
  loadNews: params => dispatch(loadNews(params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewsBlock));
