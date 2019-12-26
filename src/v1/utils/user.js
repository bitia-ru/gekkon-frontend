export const userName = user => user.name ? user.name : user.login;
export const userAvatar = user => user && user.avatar && user.avatar.url;
