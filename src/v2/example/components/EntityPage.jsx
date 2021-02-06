import React from 'react';
import PropTypes from 'prop-types';
import MainScreen from '@/v2/layouts/MainScreen/MainScreen';
import EntityLogo from '@/v2/example/components/EntityLogo';
import EntityInfoBlock from '@/v2/example/components/EntityInfoBlock';
import TabBar from '@/v1/components/TabBar/TabBar';
import { StyleSheet, css } from '@/v2/aphrodite';
import InfoPageHeader from '@/v2/components/InfoPageHeader/InfoPageHeader';
import Content from '@/v2/components/Content/Content';

const styles = StyleSheet.create({
  entityPageBlock: { minWidth: '1300px' },
  entityPageInfoBlockContainer: {
    display: 'flex',
    height: '220px',
    marginBottom: '100px',
    marginTop: '-110px',
  },
  entityPageInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '560px',
    height: '220px',
    marginLeft: '30px',
    '@media screen and (max-width: 1600px)': { width: '470px' },
  },
  entityPageTitleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '110px',
    fontFamily: 'GilroyRegular',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '40px',
    lineHeight: '50px',
    color: '#FFFFFF',
    zIndex: 1,
    '@media screen and (max-width: 1600px)': { fontSize: '34px' },
  },
  entityPageContentContainer: {
    display: 'flex',
    minWidth: '768px',
    margin: '0px 160px 100px 160px',
    flexWrap: 'wrap',
  },
  entityPageTabListContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: '1 1 auto',
    margin: '0 160px 16px auto',
  },
});

const EntityPage = ({
  poster,
  bgHeaderColor,
  logo,
  avatar,
  title,
  infoBlockItems,
  titleList,
  children,
}) => (
  <MainScreen
    header={
      <InfoPageHeader
        image={poster}
        height="385px"
        bgHeaderColor={bgHeaderColor}
      />
    }
  >
    <div className={css(styles.entityPageBlock)}>
      <div className={css(styles.entityPageInfoBlockContainer)}>
        <EntityLogo logo={logo} avatar={avatar} />
        <div className={css(styles.entityPageInfoContainer)}>
          <div className={css(styles.entityPageTitleContainer)}>{title}</div>
          <EntityInfoBlock infoBlockItems={infoBlockItems} />
        </div>
        {
          titleList && (<div className={css(styles.entityPageTabListContainer)}>
            <TabBar
              activeList={[true, true]}
              activeTab={1}
              titleList={titleList}
            />
          </div>)
        }
      </div>
      <div>{children}</div>
    </div>
  </MainScreen>
);

EntityPage.propTypes = {
  poster: PropTypes.string,
  bgHeaderColor: PropTypes.string,
  logo: PropTypes.string,
  avatar: PropTypes.string,
  title: PropTypes.string,
  infoBlockItems: PropTypes.array,
  titleList: PropTypes.array,
};

export default EntityPage;
