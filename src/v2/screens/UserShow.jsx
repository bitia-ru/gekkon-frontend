import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import * as R from 'ramda';
import UserPoster from '../components/UserPoster/UserPoster';
import { StyleSheet, css } from '../aphrodite';
import MainScreen from '../layouts/MainScreen/MainScreen';
import { loadSpecificUser as loadSpecificUserAction } from '../redux/users/actions';
import Api from '../utils/Api';


class UserShow extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentDay: dayjs().format('YYYY-MM-DD'),
      ascentsForCalendar: [],
      ascentsForPie: [],
    };
  }

  obtainUser = (userId, users) => {
    if (!users[userId]) {
      this.props.loadSpecificUser(userId);

      return {
        base_name: `User #${userId}`,
      };
    }

    const user = users[userId];

    return {
      ...user,
      base_name: user.name ? user.name : (user.login ? user.login : `User #${user.id}`),
    };
  };

  obtainUserAscentsForCalendar = (userId) => {
    const self = this;

    if (this.state.ascentsForCalendar.length === 0) {
      Api.get(
        `/v1/users/${userId}/ascents`,
        {
          params: {
            filters: {
              result: ['red_point', 'flash'],
            },
          },
          success(ascents) {
            const ascentsByDates = R.reduce(
              (a, v) => ({
                ...a,
                [v.accomplished_at]: R.propOr(0, v.accomplished_at)(a) + 1,
              }),
              {},
            )(ascents);

            self.setState({
              ascentsForCalendar: R.filter(e => (e.day !== "null"))(R.map(
                date => ({
                  day: date,
                  value: ascentsByDates[date],
                }),
              )(R.keys(ascentsByDates))),
            });
          },
        },
      );
    }

    return this.state.ascentsForCalendar;
  };

  obtainUserAscentsForPie = (userId) => {
    const self = this;

    if (this.state.ascentsForPie.length === 0) {
      Api.get(
        `/v1/users/${userId}/ascents`,
        {
          params: {
            filters: {
              result: ['red_point', 'flash'],
            },
          },
          success(ascents) {
            const categoryClass = (linear) => {
              if (linear <= 44)
                return '... - 6a';
              if (linear >= 45 && linear <= 47)
                return '6a-6a+';
              if (linear >= 48 && linear <= 50)
                return '6b-6b+';
              if (linear >= 51 && linear <= 53)
                return '6c-6c+';
              if (linear > 53)
                return '7a - ...';
            };

            const ascentsByDates = R.filter(e => (e[0] !== "null"))(R.reduce(
              (a, v) => ({
                ...a,
                [v.accomplished_at]: {
                  ...R.propOr({}, v.accomplished_at)(a),
                  [categoryClass(v.category.linear)]: R.propOr(0, categoryClass(v.category.linear))(R.propOr({}, v.accomplished_at)(a))+1,
                },
              }),
              {},
            )(ascents));

            const currentDateAscents = R.propOr({}, self.state.currentDay, ascentsByDates);

            self.setState({
              currentDayScores: Math.round(R.sum(R.map(
                a => Math.pow(1.5, a.category.linear - 30 + (a.result === 'flash' ? 0.7 : 0)),
                R.filter(a => a.accomplished_at === self.state.currentDay)(ascents),
              ))/1000.0),
            });

            self.setState({
              ascentsForPie: R.map(
                categoryClass => ({
                  id: categoryClass,
                  value: currentDateAscents[categoryClass],
                }),
              )(R.keys(currentDateAscents)),
            });
          },
        },
      );
    }

    return this.state.ascentsForPie;
  };

  render() {
    const { match, users } = this.props;

    return (
      <MainScreen
        header={
          <UserPoster
            user={this.obtainUser(match.params.user_id, users)}
          />
        }
      >
        <div className={css(style.content)}>
          <div className={css(style.row1)}>
            {
              //<ResponsiveCalendar
              //  data={this.obtainUserAscentsForCalendar(match.params.user_id)}
              //  from="2019-01-01"
              //  to="2020-12-31"
              //  emptyColor="#eeeeee"
              //  colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
              //  margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
              //  yearSpacing={40}
              //  monthBorderColor="#ffffff"
              //  dayBorderWidth={2}
              //  dayBorderColor="#ffffff"
              //  onClick={(e) => {
              //    this.setState({
              //      currentDay: e.day,
              //      currentDayScores: null,
              //      ascentsForPie: [],
              //    })
              //  }}
              ///>
            }
          </div>
          <div className={css(style.row2)}>
            <div className={css(style.leftPane)}>
              {
                //<ResponsivePie
                //  data={this.obtainUserAscentsForPie(match.params.user_id)}
                //  margin={{ top: 0, right: 80, bottom: 0, left: 80 }}
                //  innerRadius={0.5}
                //  padAngle={0.7}
                //  cornerRadius={3}
                //  borderWidth={1}
                //  borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                //  radialLabelsSkipAngle={10}
                //  radialLabelsTextXOffset={6}
                //  radialLabelsTextColor="#333333"
                //  radialLabelsLinkOffset={0}
                //  radialLabelsLinkDiagonalLength={16}
                //  radialLabelsLinkHorizontalLength={24}
                //  radialLabelsLinkStrokeWidth={1}
                //  radialLabelsLinkColor={{ from: 'color' }}
                //  slicesLabelsSkipAngle={10}
                //  slicesLabelsTextColor="#333333"
                //  animate
                //  motionStiffness={90}
                //  motionDamping={15}
                ///>
              }
            </div>
            <div className={css(style.rightPane)}>
              <div>Дата: {this.state.currentDay}</div>
              <div>Заработано очков: {this.state.currentDayScores || '-'}</div>
            </div>
          </div>
        </div>
      </MainScreen>
    );
  }
}

const style = StyleSheet.create({
  content: {
    flex: 1,
  },
  row1: {
    height: '400px',
  },
  row2: {
    display: 'flex',
    flexFlow: 'row',
  },
  leftPane: {
    flex: 1,
    height: '560px',
  },
  rightPane: {
    flex: 2,
  },
});

const mapStateToProps = state => ({
  users: state.usersStoreV2.store,
});

const mapDispatchToProps = dispatch => ({
  loadSpecificUser: userId => dispatch(loadSpecificUserAction(userId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserShow));
