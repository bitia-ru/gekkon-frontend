import { CATEGORIES } from '../../src/Constants/Categories';

const getCategoryId = (categoryFrom, categoryTo) => {
  if (categoryFrom === CATEGORIES[0] && categoryTo === '6a+') {
    return 1;
  }
  if (categoryFrom === '6a' && categoryTo === '6b+') {
    return 2;
  }
  if (categoryFrom === '6b' && categoryTo === '7a+') {
    return 3;
  }
  if (categoryFrom === '7a' && categoryTo === CATEGORIES[CATEGORIES.length - 1]) {
    return 4;
  }
  return 0;
};

export default getCategoryId;
