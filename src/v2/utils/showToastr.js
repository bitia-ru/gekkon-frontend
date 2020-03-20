export const showToastr = (msg, type, afterToastrShown) => {
  const duration = 5000;
  const lookUpTypes = {
    error: mdtoast.ERROR,
    success: mdtoast.SUCCESS,
    warning: mdtoast.WARNING,
  };
  mdtoast(msg, { duration, type: lookUpTypes[type] });
  if (afterToastrShown) {
    setTimeout(afterToastrShown, duration);
  }
};

export const displayError = (error) => {
  if (error.response.status === 404 && error.response.statusText === 'Not Found') {
    showToastr(error.response.data.message, 'error');
    return;
  }
  if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
    showToastr(error.response.data, 'error');
    return;
  }
  showToastr('Неожиданная ошибка', 'error');
};
