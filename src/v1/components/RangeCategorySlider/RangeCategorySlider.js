import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { CATEGORIES } from '@/v1/Constants/Categories';
import { css } from '@/v2/aphrodite';
import styles from './styles';


const RangeCategorySlider = ({
  categoryFrom,
  categoryTo,
  onChangeCategory,
}) => {
  const [droppedDown, setDroppedDown] = useState(true);
  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState(null);

  const sliderBarRef = useRef();

  const startEditing = (e, elem) => {
    e.preventDefault();
    setEditing(true);
    setTarget(elem);
  };

  const stopEditing = (e, elem) => {
    e.preventDefault();
    setEditing(false);
    setTarget(elem);
  };

  const categoryFromPosition = (position) => {
    const categoryIndex = position / 100 * (CATEGORIES.length - 1);
    return CATEGORIES[parseInt(categoryIndex, 10)];
  };

  const positionFromCategory = (cat) => {
    const index = R.findIndex(c => c === cat)(CATEGORIES);
    return 100 * index / (CATEGORIES.length - 1);
  };

  const changeCategoryFromHandlerPosition = (posX) => {
    const sliderBarRect = sliderBarRef.current.getBoundingClientRect();
    const dx = (posX - sliderBarRect.right) / sliderBarRect.width;
    let newPosition = (1 + dx) * 100;
    if (newPosition > 100) {
      newPosition = 100;
    }
    if (newPosition < 0) {
      newPosition = 0;
    }
    if (target === 'categoryFrom') {
      onChangeCategory(categoryFromPosition(newPosition), categoryTo);
    } else if (target === 'categoryTo') {
      onChangeCategory(categoryFrom, categoryFromPosition(newPosition));
    }
  };

  const change = (event) => {
    event.preventDefault();
    if (editing) {
      changeCategoryFromHandlerPosition(event.nativeEvent.clientX);
    }
  };

  const onMouseUp = (event) => {
    event.preventDefault();
    changeCategoryFromHandlerPosition(event.nativeEvent.clientX);
    setEditing(false);
  };

  return (
    <div
      className={css(styles.rangeCategoryBlock)}
      onBlur={() => setDroppedDown(false)}
      role="button"
      tabIndex={0}
    >
      <div
        className={css(
          styles.rangeCategoryContainer,
          droppedDown && styles.rangeCategoryContainerActive,
        )}
        onClick={() => setDroppedDown(!droppedDown)}
        role="button"
        tabIndex={0}
      >
        {`От ${categoryFrom} до ${categoryTo}`}
      </div>
      {
        droppedDown && (
          <div
            className={css(styles.rangeCategoryDropdown)}
          >
            <div
              className={css(styles.rangeCategorySlider, styles.rangeCategoryActive)}
              role="button"
              style={{ outline: 'none' }}
              onMouseUp={onMouseUp}
              onMouseMove={change}
              onMouseLeave={stopEditing}
              tabIndex={0}
            >
              <div className={css(styles.rangeCategories)}>
                {`От ${categoryFrom} До ${categoryTo}`}
              </div>
              <div className={css(styles.categorySliderContainer)}>
                <div className={css(styles.categorySliderRuler)}>
                  <div className={css(styles.categorySliderRulerItem)}>
                    {CATEGORIES[0].toUpperCase()}
                  </div>
                  <div className={css(styles.categorySliderRulerItem)}>
                    {CATEGORIES[parseInt((CATEGORIES.length - 1) / 2, 10)].toUpperCase()}
                  </div>
                  <div className={css(styles.categorySliderRulerItem)}>
                    {CATEGORIES[CATEGORIES.length - 1].toUpperCase()}
                  </div>
                </div>
                <div
                  className={css(styles.categorySliderBar)}
                  ref={sliderBarRef}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    className={css(
                      styles.categorySliderBarItem,
                      styles.categorySliderBarItemFirst,
                    )}
                  />
                  <div
                    className={css(
                      styles.categorySliderBarItem,
                      styles.categorySliderBarItemMiddle,
                    )}
                  />
                  <div
                    className={css(
                      styles.categorySliderBarItem,
                      styles.categorySliderBarItemLast,
                    )}
                  />
                  <div
                    className={css(styles.categorySliderBarHandler)}
                    role="button"
                    style={{ left: `${3.2 * (positionFromCategory(categoryFrom) - 2)}px` }}
                    onMouseDown={e => startEditing(e, 'categoryFrom')}
                    tabIndex="0"
                  />
                  <div
                    className={css(styles.categorySliderBarHandler)}
                    role="button"
                    style={{ left: `${3.2 * (positionFromCategory(categoryTo) - 2)}px` }}
                    onMouseDown={e => startEditing(e, 'categoryTo')}
                    tabIndex="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

RangeCategorySlider.propTypes = {
  categoryFrom: PropTypes.string.isRequired,
  categoryTo: PropTypes.string.isRequired,
  onChangeCategory: PropTypes.func.isRequired,
};

export default RangeCategorySlider;
