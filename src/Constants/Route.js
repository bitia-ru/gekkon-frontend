export const ROUTE_KINDS = [
  {
    id: 0, title: 'boulder', text: 'боулдер', clickable: true,
  },
  {
    id: 1, title: 'sport', text: 'трудность', clickable: true,
  },
];

export const SOON_END_PERIOD = 7; // days

export const CROP_DEFAULT = {
  aspect: 14 / 25,
  width: 530,
  x: 0,
  y: 0,
  keepSelection: true,
  locked: true,
};

export const SHORT_CLICK_DELAY = 250; // ms

export const getColorStyle = (routeMarkColor) => {
  if (routeMarkColor && routeMarkColor.photo) return { backgroundImage: `url(${routeMarkColor.photo.url})` };
  if (routeMarkColor && routeMarkColor.color) {
    return { backgroundColor: routeMarkColor.color };
  }
  return { backgroundImage: 'url(/public/img/route-img/no_color.png)' };
};
