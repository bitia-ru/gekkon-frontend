import React from 'react';
import EntityPage from '@/v2/example/components/EntityPage';
import poster from './components/images/entity_poster_example.png';
import logo from './components/images/entity_logo_example.png';
import avatar from './components/images/entity_logo_avatar_example.png';

const EntityPageExample = () => {
  const infoBlockItems = [
    { title: 'Москва', value: 'Леснорядский пер., 17к.2' },
    { title: 'Телефон', value: '+7(495)123-45-67' },
    { title: 'Работает до', value: '23:30 (ещё 6 часов)' },
  ];

  const tabsItems = [
    { id: 0, text: 'О скалодроме', content: <div>content О скалодроме</div> },
    { id: 1, text: 'Трассы', content: <div>content Трассы</div> },
  ];

  return (
    <EntityPage
      poster={poster}
      bgHeaderColor="#1A1A1A"
      logo={logo}
      avatar={avatar}
      title="Limestone"
      infoBlockItems={infoBlockItems}
      tabsItems={tabsItems}
    />
  );
};

export default EntityPageExample;
