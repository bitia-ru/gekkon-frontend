import React from 'react';
import { StyleSheet, css } from '../../aphrodite';
import CategorySlider from './CategorySlider';
import { getCategoryColor } from '@/v1/Constants/Categories';

const CategoryPickerLayout = ({
  category,
  onCategoryChanged,
}) => (
  <div className={css(style.container)}>
    <div className={css(style.categoryAsTextBlock)}>
      {category ? category.splitted.join('') : '-'}
    </div>
    <div className={css(style.colorBrick)} style={{ backgroundColor: getCategoryColor() }} />
    <CategorySlider
      category={category}
      changeCategory={
        newCategory => onCategoryChanged(newCategory)
      }
    />
  </div>
);

const style = StyleSheet.create({
  container: {
    display: 'inline-block',
  },
  categoryAsTextBlock: {
    display: 'inline-block',
  },
  colorBrick: {
    display: 'inline-block',
    width: '60px',
    height: '20px',
  },
});

export default CategoryPickerLayout;
