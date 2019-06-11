import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import {Link} from 'react-router-dom';

import {connect} from 'react-redux';
import * as actionTypes from '../../../store/actions/actions';

const styles = {
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  menuButtonHolder : {
    align:'right',
    flex:1,
  }
};

const AppBarMenu = (props) => {

  const AuthButtons = () => (
          <Grid item>
              <Button color="inherit"  component={Link} to="/login" >Login </Button>
              <Button color="inherit"  component={Link} to="/register">Register </Button>
          </Grid>
  )

  const LogoutButton = () => (
    <Grid item>
        <Button color="inherit" component={Link} to="/dashboard">Dashboard </Button>
        <Button color="inherit" component={Link} to="/new-task">New Task </Button>
        <Button color="inherit" component={Link} to="/new-label">New Label </Button>
        <Button color="inherit" component={Link} to="/groups/new-group">New Group </Button>
        <Button color="inherit" component={Link} to="/groups">Groups </Button>
        <Button color="inherit" component={Link} to="/login" onClick={props.onUserLogout} >Logout </Button>
    </Grid>
  )
  
  return (
    <div className={styles.root}>
      <AppBar position="static">
        <Toolbar>
          <Grid 
            justify="space-between"
            container 
            spacing={24}>
            <Grid item>
              <Typography variant="h6" color="inherit">
                Task Manager 1.0
              </Typography>
            </Grid>
            {props.isAuth ? LogoutButton() : AuthButtons()}
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = state => {
  return {
      isAuth:state.isAuth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUserLogout : () => {
      localStorage.removeItem('authToken');
      dispatch({type:actionTypes.LOGOUT});
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AppBarMenu);