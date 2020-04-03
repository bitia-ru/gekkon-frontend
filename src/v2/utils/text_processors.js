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
  const pathWithoutRoutes = path.pathname.match('([\\/a-z0-9]+\\/)(?:routes)');
  const params = new URLSearchParams(path.search);
  const regExp = /(#[a-zA-Zа-яА-Я0-9_-~!%&*`@$^=+]+)/g;
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
        params.set('filter[hashtag][]', hashTag);
        console.log('path: ', `${pathWithoutRoutes[1]}?${params.toString()}${path.hash}`);
        return (
          <Link
            key={`hashtag${i}`}
            to={{
              pathname: `${pathWithoutRoutes[1]}`,
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
