import React, { useState, useRef, useEffect } from 'react';
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
  const [droppedDown, setDroppedDown] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentHandler, setCurrentHandler] = useState('categoryTo');
  const [secondHandler, setSecondHandler] = useState(false);
  const [mainHandlerPosX, setMainHandlerPosX] = useState(null);
  const [secondHandlerPosX, setSecondHandlerPosX] = useState(null);

  const sliderBarRef = useRef();
  const mainHandlerRef = useRef();
  const secondHandlerRef = useRef();
  const dropdownRef = useRef();

  const handleClickOutside = (e) => {
    if (dropdownRef.current.contains(e.target)) {
      return;
    }
    setDroppedDown(false);
  };

  useEffect(() => {
    if (droppedDown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [droppedDown]);

  const startEditing = (e, handler) => {
    e.preventDefault();
    setEditing(true);
    setCurrentHandler(handler);
    if (handler === 'categoryFrom') {
      setSecondHandler(true);
    }
  };

  const stopEditing = (e) => {
    e.preventDefault();
    setEditing(false);
    setCurrentHandler(null);
  };

  const categoryFromPosition = (position) => {
    const categoryIndex = position / 100 * (CATEGORIES.length - 1);
    return CATEGORIES[parseInt(categoryIndex, 10)];
  };

  const positionFromCategory = (cat) => {
    const index = R.findIndex(c => c === cat)(CATEGORIES);
    return index / (CATEGORIES.length - 1) * 286;
  };

  useEffect(() => {
    if (positionFromCategory(categoryFrom) >= positionFromCategory(categoryTo)) {
      setSecondHandler(false);
    }
  }, [categoryFrom, categoryTo]);

  const changeCategoryFromCursorPosition = (posX) => {
    const sliderBarRect = sliderBarRef.current.getBoundingClientRect();
    const dx = (posX - sliderBarRect.right) / sliderBarRect.width;
    let newPosition = (1 + dx) * 100;
    if (newPosition > 99) {
      newPosition = 100;
    }
    if (newPosition < 0) {
      newPosition = 0;
    }

    const mainHandlerRect = mainHandlerRef.current.getBoundingClientRect();
    setMainHandlerPosX(mainHandlerRect.x);
    if (secondHandlerRef) {
      const secondHandlerRect = secondHandlerRef.current.getBoundingClientRect();
      setSecondHandlerPosX(secondHandlerRect.x);
    }

    if (secondHandler === false) {
      onChangeCategory(categoryFromPosition(newPosition), categoryFromPosition(newPosition));
      return;
    }
    if (currentHandler === 'categoryFrom') {
      onChangeCategory(categoryFromPosition(newPosition), categoryTo);
    }
    if (currentHandler === 'categoryTo') {
      onChangeCategory(categoryFrom, categoryFromPosition(newPosition));
    }
  };

  const change = (event) => {
    event.preventDefault();
    if (editing) {
      changeCategoryFromCursorPosition(event.nativeEvent.clientX);
    }
  };

  const onMouseUp = (event) => {
    event.preventDefault();
    changeCategoryFromCursorPosition(event.nativeEvent.clientX);
    setEditing(false);
  };

  const onSliderBarClick = (event) => {
    event.preventDefault();
    const posOfClick = event.nativeEvent.clientX;
    if (Math.abs(mainHandlerPosX - posOfClick) < Math.abs(secondHandlerPosX - posOfClick)) {
      setCurrentHandler('categoryTo');
    }
    if (Math.abs(mainHandlerPosX - posOfClick) > Math.abs(secondHandlerPosX - posOfClick)) {
      setCurrentHandler('categoryFrom');
    }
  };

  return (
    <div
      className={css(styles.rangeCategoryBlock)}
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
          <div className={css(styles.rangeCategoryDropdown)} ref={dropdownRef}>
            <div
              className={css(styles.rangeCategorySlider, styles.rangeCategoryActive)}
              role="button"
              style={{ outline: 'none' }}
            >
              <div className={css(styles.rangeCategories)}>
                {`От ${categoryFrom} До ${categoryTo}`}
              </div>
              <div
                className={css(styles.categorySliderContainer)}
                ref={sliderBarRef}
                role="button"
                tabIndex={0}
                onMouseDown={onSliderBarClick}
                onMouseUp={onMouseUp}
                onMouseMove={change}
                onMouseLeave={stopEditing}
              >
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
                <div className={css(styles.categorySliderBar)}>
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
                    className={css(
                      styles.categorySliderBarHandler,
                      styles.categorySliderBarHandlerActive,
                    )}
                    role="button"
                    style={{ left: `${positionFromCategory(categoryTo) - 4.5}px` }}
                    onMouseDown={e => startEditing(e, 'categoryTo')}
                    tabIndex="0"
                    ref={mainHandlerRef}
                  />
                  <div
                    className={css(
                      styles.categorySliderBarHandler,
                      secondHandler
                        ? styles.categorySliderBarHandlerActive
                        : styles.categorySliderBarHandlerInactive,
                    )}
                    role="button"
                    style={{ left: secondHandler && `${positionFromCategory(categoryFrom) - 4.5}px` }}
                    onMouseDown={e => startEditing(e, 'categoryFrom')}
                    tabIndex="0"
                    ref={secondHandlerRef}
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
