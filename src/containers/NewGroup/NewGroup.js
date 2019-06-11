import React, { Component } from 'react';
import { Paper, Grid, TextField, Button, Typography } from '@material-ui/core';
import { Create } from '@material-ui/icons'
import axios from 'axios';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions/actions';

class NewGroup extends Component {

    state = {
        name: {
            value: '',
            valid: false,
            touched: false,
            validationRules: {
                isEmpty: false
            }
        },
        description: {
            value: '',
            valid: false,
            touched: false,
            validationRules: {
                isEmpty: false
            }
        }
    }

    handleNewGroup = () => {

        axios.post('/api/groups', {
            name: this.state.name.value,
            description: this.state.description.value
        }).then(response => this.props.onTaskAdded(response.data.message))
          .catch(error => this.props.onTaskAddedError(error.response.data.message));
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
                        <Typography variant='h4'>Create new label <Create /> </Typography>
                    </Grid>
                    <Grid container alignContent='center' spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="name" label="Name" type="text" fullWidth autoFocus required
                                       onChange={(event) => this.handleInputValidation(event)}
                                       error={!this.state.name.valid && this.state.name.touched} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="description" label="Description" type="text" fullWidth required multiline rows={4}
                                       onChange={(event) => this.handleInputValidation(event)}
                                       error={!this.state.description.valid && this.state.description.touched} />
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button
                            onClick={this.handleNewGroup}
                            disabled={!this.state.name.valid || !this.state.description.valid}
                            variant="contained"
                            color="secondary"
                            style={{ textTransform: "none" }}>
                            Save Group
                        </Button>
                    </Grid>
                </div>
            </Paper>
        )
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
        onTaskAdded : (snackMessage) => dispatch({type:actionTypes.TOGGLE_SNACKBAR,message:snackMessage}),
        onTaskAddedError : (snackMessage) => dispatch({type:actionTypes.TOGGLE_SNACKBAR,message:snackMessage,variant:'error'})
    }
}

export default connect(null,mapDispatchToProps)(NewGroup);