import * as React from 'react';
import { connect } from 'react-redux';
import { changeScreen } from '../../actions/app.actions';
import { Button } from '../components';
import { Config } from './config';
import { partial } from '../../../util';
import {windowApp, verticalUiClass} from '../../styles';

import {
  Game,
} from './game';

function mapStateToProps(state) {
  return {
    currentScreen: state.app.currentScreen,
    screens: state.app.screens,
  };
}

function mapDispatchToProps(dispatch)  {
  return {
    changeScreen: (id) => dispatch(changeScreen(id)),
  };
}

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.createClass({
  render() {
    return (<div>
      <div className={ verticalUiClass }>
      {
        this.props.screens.map((screen, i) => {
          if (this.props.currentScreen === screen.id) {
            return null;
          }
          return (<Button key = {i}
                          value={ screen.name }
                          onClick={
                            partial(this.props.changeScreen, screen.id)
                          }/>);
        })
      }
      </div>
      {
        (() => {
          switch (this.props.currentScreen) {
            case 'config':
              return (<Config />);
            case 'game':
              return (<Game />);
          }
        })()
      }
    </div>);
  },
}));

