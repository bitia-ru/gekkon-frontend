import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import News from '../News/News';
import { DEFAULT_DAYS_SHOWN, DAYS_STEP } from '../../Constants/News';
import './NewsBlock.css';
import { loadNews } from '@/v1/stores/news/utils';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

class NewsBlock extends Component {
  constructor(props) {
    super(props);

    const dateTo = dayjs();
    const dateFrom = R.clone(dateTo).add(1 - DEFAULT_DAYS_SHOWN, 'day');
    this.state = {
      dateFrom,
      dateTo,
    };
  }

  componentDidMount() {
    const { dateFrom, dateTo } = this.state;
    this.loadNews(dateFrom, dateTo);
  }

  loadMoreNews = () => {
    const { dateFrom } = this.state;
    const dateFromNew = R.clone(dateFrom).add(-DAYS_STEP, 'day');
    const dateToNew = R.clone(dateFrom).add(-1, 'day');
    this.setState({ dateFrom: dateFromNew });
    this.loadNews(dateFromNew, dateToNew);
  };

  loadNews = (dateFrom, dateTo) => {
    const { loadNews: loadNewsProp } = this.props;
    const params = {
      group_by: 'day',
      filters: {
        date: [
          [dateFrom.startOf('day').format()],
          [dateTo.endOf('day').format()],
        ],
      },
    };
    loadNewsProp(params);
  };

  filteredNews = (dateFrom, dateTo) => {
    const { news: newsProp } = this.props;
    const filteredNews = R.pick(
      R.filter(
        (dateStr) => {
          const [day, month, year] = dateStr.split('.');
          const date = dayjs(`${year}-${month}-${day}`);
          return dateFrom.isBefore(date) && date.isBefore(dateTo);
        },
        R.keys(newsProp),
      ),
      newsProp,
    );
    return R.flatten(R.values(filteredNews));
  };

  showMoreNewsButton = () => {
    const { dateFrom } = this.state;
    const dateTo = R.clone(dateFrom).add(DAYS_STEP - 1, 'day');
    return this.filteredNews(dateFrom, dateTo).length > 0;
  };

  render() {
    const mapIndexed = R.addIndex(R.map);
    const { dateFrom, dateTo } = this.state;
    const filteredNews = this.filteredNews(dateFrom, dateTo);
    return (
      <>
        {
          filteredNews.length > 0 && <section
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
                        (news, index) => <News key={index} data={news}/>,
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
        }
      </>
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
