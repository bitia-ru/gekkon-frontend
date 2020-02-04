import React from 'react';
import * as R from 'ramda';
import moment from 'moment';
import { StyleSheet, css } from '../../../aphrodite';
import Calendar from '@/v1/components/Calendar/Calendar';


const RouteAscentsTableLayout = ({
  onRemoveClicked,
  onDateClicked,
  onDateSelected,
  dateChangingAscentId,
  ascents,
}) => (
  <>
    <table className={css(style.tableHeader)}>
      <thead>
        <tr>
          <th style={{width: "10%", textAlign: 'left'}}>№</th>
          <th style={{width: "25%"}}>Статус</th>
          <th style={{width: "45%", textAlign: 'left'}}>Дата</th>
          <th style={{width: "20%"}} />
        </tr>
      </thead>
    </table>
    <div className={css(style.detailsContainer)}>
      <table className={css(style.table)}>
        <tbody>
          {
            ascents && R.addIndex(R.map)(
              (ascent, i) => (
                <tr key={ascent.id || i}>
                  <td style={{width: "10%"}}>{i + 1}</td>
                  <td style={{width: "25%", textAlign: 'center'}}>
                    <img
                      src={
                        ascent.success ? (
                          require('../assets/success_indicator.svg')
                        ) : (
                          require('../assets/fail_indicator.svg')
                        )
                      }
                    />
                  </td>
                  <td
                    style={{ width: '45%', position: 'relative', cursor: 'pointer' }}
                    onClick={() => { onDateClicked && onDateClicked(ascent.id); }}
                  >
                    {ascent.accomplished_at}
                    {
                      dateChangingAscentId === ascent.id && (
                        <Calendar
                          date={moment(ascent.accomplished_at, 'YYYY-MM-DD')}
                          hide={() => { onDateClicked && onDateClicked(null); }}
                          onSelect={
                            (newDate) => {
                              onDateSelected && onDateSelected(ascent.id, newDate.format());
                            }
                          }
                        />
                      )
                    }
                  </td>
                  <td style={{width: "20%", textAlign: 'right' }}>
                    <img
                      style={{ cursor: 'pointer' }}
                      onClick={
                        () => {
                          onRemoveClicked && onRemoveClicked(ascent.id);
                        }
                      }
                      src={require('../assets/remove.svg')}
                    />
                  </td>
                </tr>
              ),
            )(ascents)
          }
        </tbody>
      </table>
    </div>
  </>
);

const style = StyleSheet.create({
  detailsContainer: {
    width: '100%',
    maxHeight: '400px',
    overflowY: 'scroll',
    marginBottom: '16px',
  },
  table: {
    width: '100%',
    borderSpacing: 0,

    '> tbody': {
      '> tr': {
        height: '40px',
        lineHeight: '40px',

        '> td': {
          '> img': {
            verticalAlign: 'middle',
          },
        },
        '> td:first-child': {
          paddingLeft: '10px',
        },
        '> td:last-child': {
          paddingRight: '10px',
        },
      },

      '> tr:nth-child(even)': {
        backgroundColor: '#EDEDED',
      },
    },
  },
  tableHeader: {
    width: '100%',
    borderSpacing: 0,

    '> thead': {
      '> tr': {
        height: '40px',
        lineHeight: '40px',

        '> th:first-child': {
          paddingLeft: '10px',
        },
        '> th:last-child': {
          paddingRight: '10px',
        },
      },
    },
  },
});

export default RouteAscentsTableLayout;
