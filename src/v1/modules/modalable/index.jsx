import React from 'react';

const isReactClassComponent = c => typeof c === 'function' && !!c.prototype.isReactComponent;

export const ModalContext = React.createContext(null);

const withModals = (BaseComponent) => {
  /*if (!isReactClassComponent(BaseComponent)) {
    throw new Error('modalable should be used with React.Component or PureComponent only.');
  }*/

  return class ModalWrapper extends BaseComponent {
    componentDidMount(...args) {
      super.componentDidMount?.apply(this, args);

      if (this.props.history) {
        const processLocation = (location) => {
          const hash = location.hash.slice(1);

          if (hash && super.modals()[hash]) {
            // check hashRoute
            // loading line - ???
            this.openModal(hash);
          }
        };

        this.modalWrapperRouterHistoryListenerUnlisten =
          this.props.history.listen(processLocation);

        processLocation(this.props.history.location);
      }

      window.addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount(...args) {
      super.componentWillUnmount?.apply(this, args);

      if (this.modalWrapperRouterHistoryListenerUnlisten) {
        this.modalWrapperRouterHistoryListenerUnlisten();
      }

      window.removeEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = (event) => {
      if (event.key === 'Escape') {
        this.closeForm();
      }
    };

    modalArgs = (name) => {
      const { modals } = this.state;
      return modals[name] ? modals[name].args : null;
    };

    openModal = (name, args) => {
      this.setState({
        modals: {
          0: {
            showedModal: name,
          },
          [name]: {
            args,
          },
        },
      });
    };

    currentModal = () => this.state?.modals?.[0]?.showedModal;

    closeModal = () => {
      const currentModal = this.currentModal();

      if (!currentModal) {
        return;
      }

      this.setState({
        modals: {
          0: null,
          [currentModal]: {
            args: null,
          },
        },
      }, () => {
        const { history } = this.props;
        const { location } = history;
        const hash = location.hash.slice(1);

        if (hash && super.modals()[hash]) {
          history.replace({ pathname: location.pathname, hash: '' });
        }
      });
    };

    modalWrapper = (name, body, args) => {
      const wrappedBody = typeof body === 'function'
        ? body({ modalArguments: args }) : React.cloneElement(body, { modalArguments: args });

      return (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => this.closeModal(name)}
        >
          <ModalContext.Provider
            value={{
              closeModal: () => { this.closeModal(name); },
            }}
          >
            {wrappedBody}
          </ModalContext.Provider>
        </div>
      );
    };

    renderModal() {
      const modalDescriptions = super.modals();
      const modalStates = this.state?.modals;

      if (!modalStates || !this.currentModal()) {
        return null;
      }

      return this.modalWrapper(
        this.currentModal(),
        modalDescriptions[this.currentModal()].body,
        modalStates[this.currentModal()]?.args,
      );

      return null;
    }

    render() {
      return (
        <>
          {this.renderModal()}
          {super.render()}
        </>
      );
    }
  };
};

export default withModals;
