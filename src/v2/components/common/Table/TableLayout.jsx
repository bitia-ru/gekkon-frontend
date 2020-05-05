import React, { isValidElement } from 'react';
import PropTypes from 'prop-types';
import { css } from '@/v2/aphrodite';
import TablePlaceholder from './TablePlaceholder';

const TableLayout = ({
  cols,
  currentCols,
  rows,
  rowFormat,
  onRowClick,
  tableStyle,
  rowStyle,
  isLoading,
}) => {
  const setContent = (row, col) => {
    if (rowFormat(row)[col] === undefined) {
      return row[col];
    }
    if (
      isValidElement(rowFormat(row)[col])
      || rowFormat(row)[col] === null
      || typeof rowFormat(row)[col] === 'string'
    ) {
      return rowFormat(row)[col];
    }
    return rowFormat(row)[col].content;
  };
  return isLoading
    ? <TablePlaceholder />
    : (
      <table className={css(tableStyle)}>
        <thead>
          <tr>
            {
              currentCols.map(
                prop => (
                  <th key={prop} style={cols[prop]?.style}>
                    {cols[prop].content || cols[prop]}
                  </th>
                ),
              )
            }
          </tr>
        </thead>
        <tbody>
          {
            rows.map(
              row => (
                <tr
                  className={css(rowStyle)}
                  key={row.key}
                  onClick={() => {
                    onRowClick(row.url);
                  }}
                >
                  {
                    currentCols.map(
                      col => (
                        <td key={col} style={rowFormat(row)[col]?.style}>
                          {setContent(row, col)}
                        </td>
                      ),
                    )
                  }
                </tr>
              ),
            )
          }
        </tbody>
      </table>
    );
};

TableLayout.propTypes = {
  cols: PropTypes.object,
  tableStyle: PropTypes.object,
  rowStyle: PropTypes.object,
  currentCols: PropTypes.array,
  rows: PropTypes.array,
  onRowClick: PropTypes.func,
  rowFormat: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default TableLayout;
