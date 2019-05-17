export const CardsData = [
    {
        id: 1,
        imgAlt: 'Карточка 1',
        title: 'Название трассы',
        dateTime: '2018-10-15',
        dateTimeText: '15.10.2018',
    },
    {
        id: 2,
        imgSrc: '/public/img/route-card-img/route-card-img.jpg',
        imgAlt: 'Карточка 1',
        title: 'Название трассы',
        dateTime: '2018-10-15',
        dateTimeText: '15.10.2018',
    },
    {
        id: 3,
        imgSrc: '/public/img/route-card-img/route-card-img.jpg',
        imgAlt: 'Карточка 1',
        title: 'Название трассы',
        dateTime: '2018-10-15',
        dateTimeText: '15.10.2018',
    },
    {
        id: 4,
        imgSrc: '/public/img/route-card-img/route-card-img.jpg',
        imgAlt: 'Карточка 1',
        title: 'Название трассы',
        dateTime: '2018-10-15',
        dateTimeText: '15.10.2018',
    },
    {
        id: 5,
        imgSrc: '/public/img/route-card-img/route-card-img.jpg',
        imgAlt: 'Карточка 1',
        title: 'Название трассы',
        dateTime: '2018-10-15',
        dateTimeText: '15.10.2018',
    },
    {
        id: 6,
        imgSrc: '/public/img/route-card-img/route-card-img.jpg',
        imgAlt: 'Карточка 1',
        title: 'Название трассы',
        dateTime: '2018-10-15',
        dateTimeText: '15.10.2018',
    },
    {
        id: 7,
        imgSrc: '/public/img/route-card-img/route-card-img.jpg',
        imgAlt: 'Карточка 1',
        title: 'Название трассы',
        dateTime: '2018-10-15',
        dateTimeText: '15.10.2018',
    },
];

export const ItemsData = [
    {id: 0, title: 'Все', clickable: true},
    {id: 1, title: 'Позиция 1', clickable: true},
    {id: 2, title: 'Позиция 2', clickable: true},
    {id: 3, title: 'Позиция 3', clickable: true},
];

export const UserItemsData = [
    {separator: true},
    {id: 1, title: 'Профиль', clickable: true},
    {id: 2, title: 'Выйти', clickable: true, svgSrc: '/public/img/main-nav-img/exit.svg#exit'}
];

export const GuestItemsData = [
    {title: 'Гость'},
    {separator: true},
    {id: 1, title: 'Зарегистрироваться', clickable: true},
    {id: 2, title: 'Войти', clickable: true}
];

export const CategoriesData = [
    {id: 0, title: 'Все', clickable: true},
    {id: 1, title: '6A+ и ниже', clickable: true},
    {id: 2, title: '6C+ и ниже', clickable: true},
    {id: 3, title: '7A и выше', clickable: true}
];

export const SpotsData = [
    {
        id: 1,
        name: 'Гравитация',
        info1: 'Более 800 м² лазательной поверхности',
        info2: '12-метровые трассы на трудность',
        info3: 'Мунборд',
        address: 'Москва, ул. Новоостаповская д.5, стр.2',
        description: 'Самый большой зал на трудность в Москве. Разнообразные виды поверхностей, включая участки с ' +
            'потолками, карнизы. Стенд с воспроизводством естественной скальной поверхности. Автостраховки. Имеется ' +
            'небольшой болдеринговый зал.',
        imgSrc: '/public/img/spot-card-img/gravity.jpg',
        className: 'spot-card_gravity'
    },
    {
        id: 2,
        name: 'Лаймстоун',
        info1: '800 м² лазательной поверхности',
        info2: 'Просторная многофункциональная разминочная зона',
        info3: 'Мунборд',
        info4: 'Кампусборд',
        address: 'Москва, пер. Леснорядский д.18, стр.6',
        description: 'Самый большой боулдеринговый зал в Москве.',
        imgSrc: '/public/img/spot-card-img/limestone.jpg',
        className: 'spot-card_limestone'
    },
    {
        id: 3,
        name: 'Атмосфера',
        info1: 'Каждую неделю новые трассы',
        info2: 'Высота стен до 9 метров',
        info3: 'Более 1500 зацепов',
        address: 'Москва, Электролитный пр.7, стр.2, СК КАНТ',
        description: 'Высокое качество скальной поверхности и расширенные возможности боулдерингового\n' +
        '                                зала совместно с регулярной перекруткой и обновлением трасс',
        imgSrc: '/public/img/spot-card-img/atmosphere.jpg',
        className: 'spot-card_atmosphere'
    },
    {
        id: 4,
        name: 'Токио',
        info1: 'Европейские зацепки и интересные трассы',
        info2: 'Зоны для функциональных тренировок и растяжки',
        info3: 'Качественное, светлое помещение',
        address: 'Москва, ул. Новодмитровская 5А, стр 3, 1 подьезд, 3 этаж',
        description: 'Высокое качество скальной поверхности и расширенные возможности боулдерингового\n' +
        '                                зала совместно с регулярной перекруткой и обновлением трасс',
        imgSrc: '/public/img/spot-card-img/tokyo.jpg',
        className: 'spot-card_tokyo'
    }
];
