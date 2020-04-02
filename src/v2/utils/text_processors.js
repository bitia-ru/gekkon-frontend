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

export const wrapHashtagInText = (url, params, text) => {
  const path = url.split('/routes')[0];
  const urlWithParams = `https:/${path}${params ? `${params}&filter[hashtag][]=` : '?filter[hashtag][]='}`;
  const regExp = /(#[a-zA-Zа-яА-Я0-9_\-~!%&*`@$^=+]+)/g;
  const mapIndexed = R.addIndex(R.map);
  const preparedText = R.flatten(mapIndexed(
    (e, i) => (
      typeof e === 'object' ? e : R.split(regExp, e)
    ),
  )(text));
  return mapIndexed(
    (e, i) => {
      if (e[0] === '#') {
        const hashTag = e.slice(1);
        return <a key={`link${i}`} href={`${urlWithParams}${hashTag}`}>{e}</a>;
      }
      return e;
    },
  )(preparedText);
};
