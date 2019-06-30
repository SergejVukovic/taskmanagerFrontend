import React, {Component} from 'react';
import { Paper, Grid, TextField, Button,Typography } from '@material-ui/core';
import { Face, Fingerprint, Email, Lock } from '@material-ui/icons'
import axios from 'axios';

import * as actionTypes from '../../store/actions/actions';
import {connect} from 'react-redux';

class Register extends Component {

    state = {
        name : {
            value : '',
            valid : false,
            touched : false,
            validationRules : {
                isEmpty : false
             }
        },
        email : {
            value : '',
            valid : false,
            touched : false,
            validationRules : {
                isEmpty : false
             }
        },
        password : {
            value : '',
            valid : false,
            touched : false,
            validationRules : {
               isEmpty : false
            }
        },
        password_confirmation : {
            value : '',
            valid : false,
            touched : false,
            validationRules : {
               isEmpty : false,
               isExactPassword : true
            }
        }

    }

    handleRegister = () => {

        axios.post('/api/users/register',{
            name  : this.state.name.value,
            email : this.state.email.value,
            password : this.state.password.value,
            password_confirmation : this.state.password_confirmation.value
        })
        .then(() => {
            return axios.post('/api/users/login', {
               email : this.state.email.value,
               password : this.state.password.value
            });
        }).then(result => {
            if(result.data.token){
                this.props.onUserRegistration(result.data.token);
                this.props.history.push("/dashboard");
            }
        })
        .catch(error => this.props.onUserRegistrationError(error.response.data.message));
    }

    checkValidity = (value,rules)=>{

        let isValid = false;

        if(!rules.isEmpty){
            isValid = value.trim() !== '';
        }

        if(rules.isExactPassword){
            isValid = value.trim() === this.state.password.value;
        }

        return isValid;
    }

    handleInputValidation = (event) => {
        let currentValidatingInput     = {...this.state[event.target.id]};
        currentValidatingInput.valid   = this.checkValidity(event.target.value,currentValidatingInput.validationRules);
        currentValidatingInput.touched = true;
        currentValidatingInput.value   = event.target.value;
        this.setState({[event.target.id]:currentValidatingInput})
    }


    render () {
        return (
        <Paper style={{width:'50%', margin:'auto',marginTop:'10%',alignContent:'center',padding:'5%'}}>
            <div className={styles.margin}>
                <Grid container justify="center" style={{ marginBottom: '10%' }}>
                    <Typography variant='h4'>Register</Typography>
                </Grid>
                <Grid container alignContent='center' spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Face />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField id="name" label="Name" type="text" fullWidth  autoFocus required
                        onChange={(event)=>this.handleInputValidation(event)}
                        error = {!this.state.name.valid && this.state.name.touched } />
                    </Grid>
                </Grid>
                <Grid container alignContent='center' spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Email />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField id="email" label="Email" type="email" fullWidth required 
                        onChange={(event)=>this.handleInputValidation(event)}
                        error = {!this.state.email.valid && this.state.email.touched }/>
                    </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Fingerprint />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField id="password" label="Password" type="password" fullWidth  required 
                        onChange={(event)=>this.handleInputValidation(event)}
                        error = {!this.state.password.valid && this.state.password.touched }/>
                    </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Lock />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField id="password_confirmation" label="Password Confirmation" type="password" fullWidth  required 
                        onChange={(event)=>this.handleInputValidation(event)}
                        error = {!this.state.password_confirmation.valid && this.state.password_confirmation.touched }/>
                    </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Button 
                    onClick={this.handleRegister}
                    disabled={!this.state.password.valid || !this.state.email.valid || !this.state.name.valid || !this.state.password_confirmation.valid}
                    variant="outlined"
                    color="primary"
                    style={{ textTransform: "none" }}
                    >
                    Register
                    </Button>
                </Grid>
            </div>
        </Paper>
        );
    }
}

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit * 2,
    },
    padding: {
        padding: theme.spacing.unit
    }
});

const mapDispatchToState = dispatch => {
    return {
        onUserRegistration : (token) => {
            localStorage.authToken = token;
            dispatch({type : actionTypes.AUTHENTICATED})
        },
        onUserRegistrationError : (snackMessage) => dispatch({type:actionTypes.TOGGLE_SNACKBAR,message:snackMessage,variant:'error'})
    }
}

export default connect(null,mapDispatchToState)(Register);