import React, { Component } from 'react';
import {Route,Redirect,Switch,withRouter} from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';

import AppBarMenu from './components/UI/AppBarMenu/AppBarMenu';
import Login from './containers/Login/Login';
import Register from './containers/Register/Register';
import Dashboard from './containers/Dashboard/Dashboard';
import NewTask from './containers/NewTask/NewTask';
import NewLabel from './containers/NewLabel/NewLabel';

import './App.css';
import {connect} from 'react-redux';
import * as actionTypes from './store/actions/actions';
import CustomSnackbarContent from './components/UI/CustomSnackbarContent/CustomSnackbarContent';


class App extends Component {

  render() {
    return (
      <div className="App">
        <AppBarMenu />

        <Switch>
          {this.props.isAuth ? <Route exact path="/new-task"  component={NewTask} /> : null}
          {this.props.isAuth ? <Route exact path="/new-label" component={NewLabel} /> : null}
          {this.props.isAuth ? <Route exact path="/dashboard" component={Dashboard} /> : null}
          <Route exact path="/login" component={Login}/>
          <Route exact path="/register" component={Register}/>
          <Redirect from="/" to="/login" />
        </Switch>

        <Snackbar
          anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
          open={this.props.snackbar.open}
          onClose={this.props.snackbarClose}
          autoHideDuration={4000}>
          <CustomSnackbarContent 
            message={<span id="message-id">{this.props.snackbar.message}</span>}
            variant = {this.props.snackbar.variant}
          />
        </Snackbar>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuth : state.isAuth,
    snackbar : state.snackbar
  }
}

const mapDispatchToProps = dispatch => {
  return {
    snackbarClose : () => dispatch({type:actionTypes.TOGGLE_SNACKBAR})
  }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
