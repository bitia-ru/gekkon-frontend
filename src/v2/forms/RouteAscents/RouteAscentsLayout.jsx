import React from 'react';
import { StyleSheet, css } from '../../aphrodite';
import CategoryPicker from '../../components/CategoryPicker/CategoryPicker';
import RouteAscentsTable from './RouteAscentsTable/RouteAscentsTable';
import AscentTriptych from '../../components/ascents/AscentTriptych';
import FormExpandableArea from '../../components/forms/FormExpandableArea';


const RouteAscentsLayout = ({
  title,
  blameCategory,
  categoryOpinion,
  onCategoryOpinionChanged,
  details,
  initialWithFlash,
  onAddAscents,
  onRemoveAscent,
  onAscentDateChanged,
  ascents,
}) => (
  <div className={css(style.container)}>
    <div className={css(style.titleRow)}>{title}</div>
    <div className={css(style.tryptichRow)}>
      <AscentTriptych
        initialWithFlash={initialWithFlash}
        instantMode={false}
        onAddAscents={
          (ascents, afterAscentsAdded) => onAddAscents && onAddAscents(ascents, afterAscentsAdded)
        }
      />
    </div>
    {
      details && details.show && (
        <FormExpandableArea initiallyExpanded={ascents && ascents.length > 0}>
          <RouteAscentsTable
            ascents={ascents}
            onAscentDateChanged={
              (ascentId, newDate) => {
                onAscentDateChanged && onAscentDateChanged(ascentId, newDate);
              }
            }
            onRemoveAscent={
              (ascentId) => {
                onRemoveAscent && onRemoveAscent(ascentId);
              }
            }
          />
        </FormExpandableArea>
      )
    }
    {
      false && (
        <div className={css(style.categoryBlameRow)}>
        {
          blameCategory
            ? <>
              {'Моя оценка: '}
              <CategoryPicker
                category={categoryOpinion}
                changeCategory={
                  category => onCategoryOpinionChanged(category)
                }
              />
            </>
            : 'Не согласен с категорией!'
        }
        </div>
      )
    }
  </div>
);

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
  },
  titleRow: {
    fontFamily: 'GilroyBold, sans-serif',
    fontSize: '24px',
    marginBottom: '20px',
  },
  tryptichRow: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  categoryBlameRow: {
    color: '#006CEB',

    ':hover': {
      cursor: 'pointer',
      color: '#005eb9',
      backgroundColor: 'rgba(0,0,0,0.02)',
    },
  },
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

export default RouteAscentsLayout;
