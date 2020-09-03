import React from 'react';
import * as R from 'ramda';
import { Link } from 'react-router-dom';

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

export const wrapHashtagInText = (path, text) => {
  const routesRegExp = /([/a-z0-9]+)\/routes/;
  const pathWithoutRoutes = path.pathname.match(routesRegExp)[1];
  const params = new URLSearchParams(path.search);
  const hashTagRegExp = /(?<!\S)(#[a-zA-Zа-яА-Я0-9_]+)/g;
  const mapIndexed = R.addIndex(R.map);
  const preparedText = R.flatten(R.map(
    e => (
      typeof e === 'string' ? R.split(hashTagRegExp, e) : e
    ),
  )(text));
  return mapIndexed(
    (e, i) => {
      if (hashTagRegExp.test(e)) {
        const hashTag = e.slice(1);
        params.set('filter[hashtag][]', hashTag);
        return (
          <Link
            key={`hashtag${i}`}
            to={{
              pathname: `${pathWithoutRoutes}`,
              search: `?${params.toString()}`,
              hash: `${path.hash}`,
            }}
          >
            {e}
          </Link>
        );
      }
      return e;
    },
  )(preparedText);
};
