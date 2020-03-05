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
}) => {
  const isRowsLoading = rowsData => rowsData.length === 1;
  return (
    isRowsLoading(rows)
      ? <TablePlaceholder />
      : <table className={css(tableStyle)}>
        <thead>
          <tr>
            {
              currentCols.map(
                (prop) => {
                  if (typeof cols[prop] === 'string') {
                    return <th key={prop}>{cols[prop]}</th>;
                  }
                  return <th key={prop} style={cols[prop]?.style}>{cols[prop].content}</th>;
                },
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
                      (col) => {
                        if (rowFormat(row)[col] === undefined) {
                          return <td key={col}>{row[col]}</td>;
                        }
                        if (
                          isValidElement(rowFormat(row)[col])
                          || rowFormat(row)[col] === null
                          || typeof rowFormat(row)[col] === 'string'
                        ) {
                          return <td key={col}>{rowFormat(row)[col]}</td>;
                        }
                        return (
                          <td key={col} style={rowFormat(row)[col]?.style}>
                            {rowFormat(row)[col].content}
                          </td>);
                      },
                    )
                  }
                </tr>
              ),
            )
          }
        </tbody>
      </table>
  );
}


TableLayout.propTypes = {
  cols: PropTypes.object,
  tableStyle: PropTypes.object,
  rowStyle: PropTypes.object,
  currentCols: PropTypes.array,
  rows: PropTypes.array,
  onRowClick: PropTypes.func,
  rowFormat: PropTypes.func,
};

export default TableLayout;
