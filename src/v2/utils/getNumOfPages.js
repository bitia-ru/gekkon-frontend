const getNumOfPages = (state) => {
  const { routesStoreV2 } = state;
  if (routesStoreV2.filtrationResults[0]) {
    return routesStoreV2.filtrationResults[0].numOfPages;
  }
  return 0;
};

export default getNumOfPages;
