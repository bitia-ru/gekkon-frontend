export const PASSWORD_MIN_LENGTH = 6;

export const GetUserName = (user, selfDisplayed) => {
  if (!user) { return null; }
  if (user.name) { return user.name; }
  if (user.login) { return user.login; }
  if (user.email && selfDisplayed) { return user.email; }
  if (user.phone && selfDisplayed) { return user.phone; }
  return null;
};

export const SEARCH_DELAY = 3000;

export const USER_ITEMS_DATA = [
  { separator: true },
  { id: 1, title: 'Профиль', clickable: true },
  {
    id: 2,
    title: 'Выйти',
    clickable: true,
    svgSrc: `${require('../../../img/main-nav-img/exit.svg').default}#exit`,
  },
];

export const GUEST_ITEMS_DATA = [
  { title: 'Гость' },
  { separator: true },
  { id: 1, title: 'Зарегистрироваться', clickable: true },
  { id: 2, title: 'Войти', clickable: true },
];
