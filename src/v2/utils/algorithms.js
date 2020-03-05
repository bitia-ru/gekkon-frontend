import * as R from 'ramda';


export const joinObjects = (a, separator) => (
  R.reduce((acc, item) => [...acc, separator, item], [])(a).slice(1)
);
