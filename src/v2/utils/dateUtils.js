import dayjs from 'dayjs';

export const dateIsBetween = (date, dateFrom, dateTo) => {
  if (!date) {
    return false;
  }

  const preparedDate = date ? dayjs(date) : null;
  const preparedDateFrom = dateFrom ? dayjs(dateFrom) : null;
  const preparedDateTo = dateTo ? dayjs(dateTo) : null;
  if (preparedDateFrom) {
    if (preparedDateTo) {
      if (preparedDate >= preparedDateFrom && preparedDate < preparedDateTo) {
        return true;
      }
      return false;
    }
    if (preparedDate >= preparedDateFrom) {
      return true;
    }
    return false;
  }
  return true;
};
