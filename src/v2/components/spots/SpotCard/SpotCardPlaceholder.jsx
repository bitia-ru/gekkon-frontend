import React from 'react';
import ContentLoader from 'react-content-loader';


const SpotCardPlaceholder = () => (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 250 360"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="0" rx="2%" ry="0%" width="100%" height="30%" />
    <rect x="2%" y="33%" rx="2%" ry="2%" width="30%" height="2%" />
    <rect x="2%" y="38%" rx="2%" ry="2%" width="60%" height="4%" />
    <rect x="2%" y="45%" rx="2%" ry="2%" width="9%" height="7%" />
    <rect x="16%" y="47.5%" rx="2%" ry="2%" width="30%" height="2%" />
    <rect x="62%" y="47.5%" rx="2%" ry="2%" width="30%" height="2%" />
    <rect x="2%" y="55%" rx="2%" ry="2%" width="9%" height="7%" />
    <rect x="16%" y="57.5%" rx="2%" ry="2%" width="30%" height="2%" />
    <rect x="62%" y="57.5%" rx="2%" ry="2%" width="30%" height="2%" />
    <rect x="16%" y="67.5%" rx="2%" ry="2%" width="30%" height="2%" />
    <rect x="2%" y="75%" rx="2%" ry="2%" width="9%" height="7%" />
    <rect x="16%" y="77.5%" rx="2%" ry="2%" width="30%" height="2%" />
    <rect x="62%" y="77.5%" rx="2%" ry="2%" width="30%" height="2%" />
    <rect x="16%" y="87.5%" rx="2%" ry="2%" width="30%" height="2%" />
    <rect x="62%" y="87.5%" rx="2%" ry="2%" width="30%" height="2%" />
  </ContentLoader>
);

export default SpotCardPlaceholder;
