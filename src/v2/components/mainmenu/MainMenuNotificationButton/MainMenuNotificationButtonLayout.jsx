import React from 'react';
import { StyleSheet, css } from '../../../aphrodite';
import List from '@/v1/components/List/List';
import { GUEST_ITEMS_DATA } from '@/v1/Constants/User';


const listPinImage = 'data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2223%22%20height%3D%2214%22%20viewBox%3D%220%200%2023%2014%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cmask%20id%3D%22mask0%22%20mask-type%3D%22alpha%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%220%22%20y%3D%220%22%20width%3D%2223%22%20height%3D%2214%22%3E%0A%3Crect%20width%3D%2223%22%20height%3D%2214%22%20fill%3D%22%23C4C4C4%22/%3E%0A%3C/mask%3E%0A%3Cg%20mask%3D%22url%28%23mask0%29%22%3E%0A%3Cpath%20d%3D%22M11.5%200L23.1913%2014.25H-0.191343L11.5%200Z%22%20fill%3D%22white%22/%3E%0A%3C/g%3E%0A%3C/svg%3E%0A';

const MainMenuNotificationButtonLayout = ({children, expanded, onRingerClick, onFocusOut}) => (
  <div className={css(style.container)} onBlur={onFocusOut && onFocusOut}>
    <div
      className={
        css(
          style.expandableContainer,
          expanded && style.expandableContainerExpanded,
        )
      }
    >
      <div className={css(style.ringerContainer)} onClick={onRingerClick && onRingerClick}>
        <div className={css(style.ringerWrapper)}>
          <img tabIndex={0} src={require('./assets/ringer.svg')} />
        </div>
        {
          expanded && (
            <div className={css(style.notificationListContainer)}>
              <div className={css(style.notificationListPin)}><img src={listPinImage}/></div>
              <div className={css(style.notificationList)}>
                <List
                  items={GUEST_ITEMS_DATA}
                  onClick={(a) => {
                    console.log(a);
                  }}
                  textFieldName="title"
                />
              </div>
            </div>
          )
        }
      </div>
      <div className={css(style.childrenContainer)}>
        {children}
      </div>
    </div>
  </div>
);

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '75px',
  },
  expandableContainer: {
    position: 'absolute',
    right: 0,
    height: '100%',
    width: '100%',
    transition: 'width .3s ease-out',

    ':hover': {
      width: '200%',
    },
  },
  expandableContainerExpanded: {
    width: '200%',
  },
  childrenContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  ringerContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  ringerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    width: '50%',
    borderLeft: 'solid 1px #D8D8D8',

    '> img': {
      borderRadius: '50%',
      padding: 0,
      outline: 0,
      transition: 'padding .3s ease-out',

      ':hover': {
        cursor: 'pointer',
        backgroundColor: 'rgba(0,0,0,0.04)',
        padding: '15px',
      },
      ':active': {
        transition: 'padding .0s ease-out',
        padding: '5px',
      },
    },
  },
  notificationListContainer: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: '50%',

    display: 'flex',
    flexFlow: 'column',
  },
  notificationListPin: {
    position: 'relative',
    height: '15px',

    '> img': {
      height: '100%',
      position: 'absolute',
      right: '25px',
    },
  },
  notificationList: {
    flex: 1,
    backgroundColor: 'white',
  },
});

// TODO: children should be the single element and should be not null.

export default MainMenuNotificationButtonLayout;
