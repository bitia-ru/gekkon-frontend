export const logIn = (history) => { history.push('#signin'); };

export const logOut = () => {
  localStorage.removeItem('reduxState');
  window.location.href = '/';
};

export const signUp = (history) => { history.push('#signup'); };
