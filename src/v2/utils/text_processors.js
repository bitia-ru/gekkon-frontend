import React from 'react';
import * as R from 'ramda';

export const wrapWebLinksInText = (text) => {
  const regExp = /\b(?:([A-Za-z]+):\/\/)?(?:([A-Za-z0-9]+)\:([A-Za-z0-9]+)\@)?((?:[A-Za-z0-9]+\.)+[A-Za-z0-9]+)(?:\:([0-9]+))?(?:\/((?:[A-Za-z0-9]+)(?:\/[A-Za-z0-9]+)*(?:\.[A-Za-z0-9]+)?)?(\?[A-Za-z0-9]+=[A-Za-z0-9]+(?:&[A-Za-z0-9]+=[A-Za-z0-9]+)*)?(?:#([A-Za-z0-9]+))?)?\s/gi;
  const linkExtractor = '_^link^_';
  const preparedText = text.replace(regExp, s => `${linkExtractor}${s}${linkExtractor}`);
  const mapIndexed = R.addIndex(R.map);
  return mapIndexed(
    (e, i) => (
      i % 2 === 0 ? e : <a key={`link${i}`} href={e}>{e}</a>
    ),
  )(preparedText.split(linkExtractor));
};
