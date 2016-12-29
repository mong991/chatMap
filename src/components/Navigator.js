import React, { Component } from 'react';
import { Actions, DefaultRenderer } from 'react-native-router-flux';
import Drawer from 'react-native-drawer';
import SideMenu from './SideMenu';

export default class mydrawer extends Component {
    componentWillReceiveProps(props) {
      if (props.navigationState.open) {
        this.openControlPanel();
      } else {
        this.closeControlPanel();
      }
    }
    closeControlPanel = () => {
      this.drawer.close();
    }

    openControlPanel = () => {
      this.drawer.open();
    }
    render() {
        const state = this.props.navigationState;
        const children = state.children;
        return (
            <Drawer
                ref={(ref) => this.drawer = ref}
                open={state.open}
                onOpen={() => Actions.refresh({ key: state.key, open: true })}
                onClose={() => Actions.refresh({ key: state.key, open: false })}
                type="displace"
                content={<SideMenu close={this.closeControlPanel.bind(this)} />}
                tapToClose
                openDrawerOffset={0.4}
                panCloseMask={0.4}
                negotiatePan
                tweenHandler={
                  (ratio) => ({
                    main: { opacity: Math.max(0.54, 1 - ratio) }
                  })
                }
            >
                <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />

            </Drawer>
        );
    }
}
