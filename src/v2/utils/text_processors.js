import React from 'react';
import * as R from 'ramda';

export const wrapWebLinksInText = (text) => {
  const regExp = /\b((?:[A-Za-z]+:\/\/)?(?:[A-Za-z0-9]+\:[A-Za-z0-9]+\@)?(?:[A-Za-z0-9]+\.)+[A-Za-z0-9]+(?:\:[0-9]+)?(?:\/(?:[A-Za-z0-9]+(?:\/[A-Za-z0-9]+)*(?:\.[A-Za-z0-9]+)?)?(?:\?[A-Za-z0-9]+=[A-Za-z0-9]+(?:&[A-Za-z0-9]+=[A-Za-z0-9]+)*)?(?:#[A-Za-z0-9]+)?)?)\b/gi;
  const preparedText = R.split(regExp, text);
  const mapIndexed = R.addIndex(R.map);
  return mapIndexed(
    (e, i) => (
      i % 2 === 0 ? e : <a key={`link${i}`} href={e}>{e}</a>
    ),
  )(preparedText);
};
