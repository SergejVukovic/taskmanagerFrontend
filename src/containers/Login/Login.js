import React, { Component } from 'react';
import { Paper, Grid, TextField, Button, Typography } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons'
import axios from 'axios';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions/actions';

class Login extends Component {
    state = {
        email: {
            value: '',
            valid: false,
            touched: false,
            validationRules: {
                isEmpty: false
            }
        },
        password: {
            value: '',
            valid: false,
            touched: false,
            validationRules: {
                isEmpty: false
            }
        }
    }

    handleLogin = () => {

        axios.post('/api/login', {
            email: this.state.email.value,
            password: this.state.password.value
        })
            .then(result => {
                if (result.data.token) {
                    this.props.onUserLogin(result.data.token);
                    this.props.history.push("/dashboard");
                }
            })
            .catch(error => this.props.onUserLoginError(error.response.data.error));
    }

    checkValidity = (value, rules) => {
        let isValid = false;

        if (!rules.isEmpty) {
            isValid = value.trim() !== '';
        }
        return isValid;
    }

    handleInputValidation = (event) => {
        let currentValidatingInput = { ...this.state[event.target.id] };
        currentValidatingInput.valid = this.checkValidity(event.target.value, currentValidatingInput.validationRules);
        currentValidatingInput.touched = true;
        currentValidatingInput.value = event.target.value;
        this.setState({ [event.target.id]: currentValidatingInput })
    }

    render() {
        return (
            <Paper style={{ width: '50%', margin: 'auto', marginTop: '10%', alignContent: 'center', padding: '5%' }}>
                <div className={styles.margin}>
                    <Grid container justify="center" style={{ marginBottom: '10%' }}>
                        <Typography variant='h4'>Login</Typography>
                    </Grid>
                    <Grid container alignContent='center' spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Face />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="email" label="Email" type="email" fullWidth autoFocus required
                                onChange={(event) => this.handleInputValidation(event)}
                                error={!this.state.email.valid && this.state.email.touched ? true : false} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Fingerprint />
                        </Grid>

                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="password" label="Password" type="password" fullWidth required
                                onChange={(event) => this.handleInputValidation(event)}
                                error={!this.state.password.valid && this.state.password.touched ? true : false} />
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button
                            onClick={this.handleLogin}
                            disabled={!this.state.password.valid || !this.state.email.valid}
                            variant="outlined"
                            color="primary"
                            style={{ textTransform: "none" }}>
                            Login
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

const mapDispatchToProps = dispatch => {
    return {
        onUserLogin : (token) => {
            localStorage.authToken = token;
            dispatch({type : actionTypes.AUTHENTICATED})
        },
        onUserLoginError : (snackMessage)=>dispatch({type:actionTypes.TOGGLE_SNACKBAR,message:snackMessage,variant:'error'})
    }
}

export default connect(null,mapDispatchToProps)(Login);