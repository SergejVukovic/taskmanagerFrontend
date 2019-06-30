import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import TaskCard from '../TaskCard/TaskCard';

class Dashboard extends Component {

    state = {
        tasks: false,
        groups: [],
        allUserLabels: null,
        startTime : null,
        endTime : null,
        status : 'working'
    }

    componentDidMount() {
        //If token is expired and user dose not relode the page have to set Auth header again
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.authToken}`;

        axios.get('/api/tasks')
            .then(response => {
                this.setState({ tasks: response.data })
            })
            .catch(error => {
                localStorage.removeItem('authToken');
                this.props.history.push('/login');
            });

        axios.get('api/labels')
            .then(response => this.setState({ allUserLabels: response.data }))
            .catch(error => {
                localStorage.removeItem('authToken');
                this.props.history.push('/login');
            });

        axios.get('/api/groups/user')
            .then(response => {
                this.setState({groups: response.data})
            })

    }

    componentDidUpdate() {
        if (this.props.finishedTask || this.props.deletedTask) {
            // Remove finishedTask or deletedTask from tasks array
            this.setState(prevState => {
                let newTaskList = prevState.tasks.filter(task => {
                    return this.props.finishedTask !== task.id && this.props.deletedTask !== task.id
                })
                return {
                    ...prevState,
                    tasks: newTaskList
                }
            });

            //check which action happend and remove/update task in DB
            if(this.props.finishedTask){
                axios.put(`/api/tasks/${this.props.finishedTask}`,{
                    id : this.props.finishedTask,
                    status : "done"
                })
                .then(response => this.props.requestSuccess("Task finished"))
                .catch(error => this.props.requestError(error.response.data.title))
                this.props.taskDone();
            }else if(this.props.deletedTask){
                axios.delete(`/api/tasks/${this.props.deletedTask}`)
                .then(response => this.props.requestSuccess("Task removed"))
                .catch(error => this.props.requestError(error.response.data.title));
                this.props.taskDeleted();
            }
            
        }
    }

    handleDateRangeChange = (e) => {
        this.setState({[e.target.name]:e.target.value})
    }

    filterTasksByDate = () => {

        const params = {};

        if (this.state.startTime) {
            params.startTime = this.state.startTime;
        }

        if(this.state.endTime){
            params.endTime = this.state.endTime;
        }

        params.status = this.state.status;

        axios.get('/api/tasks', {
            params: params
        })
            .then(response => {
                this.setState({ tasks: response.data })
            })
            .catch(error => {
                localStorage.removeItem('authToken');
                this.props.history.push('/login');
            });
    }

    render() {



        let TaskList = null;

        if (this.state.tasks && this.state.allUserLabels) {
            TaskList = this.state.tasks.map(task => {
                let taskLabels =[];
                task.labelsTasks.forEach(labelsTasksLookupTable => {
                    if(labelsTasksLookupTable.labels) {
                        taskLabels.push(labelsTasksLookupTable.labels);
                    }
                });
                return (
                    <TaskCard
                        key={task.id}
                        taskid={task.id}
                        title={task.taskTitle}
                        description={task.taskDescription}
                        tasklabels={taskLabels}
                        labels={this.state.allUserLabels}
                        groups={this.state.groups}
                    />
                )
            })
        }

        return (
            <div>
                {/*<form noValidate>*/}
                {/*    <TextField*/}
                {/*        id="date1"*/}
                {/*        name={"startTime"}*/}
                {/*        label="Select all tasks from : "*/}
                {/*        type="date"*/}
                {/*        defaultValue="2017-05-24"*/}
                {/*        InputLabelProps={{*/}
                {/*            shrink: true,*/}
                {/*        }}*/}
                {/*        onChange={this.handleDateRangeChange}*/}
                {/*    />*/}
                {/*    <TextField*/}
                {/*        id="date2"*/}
                {/*        name={"endTime"}*/}
                {/*        label="Select all tasks to : "*/}
                {/*        type="date"*/}
                {/*        defaultValue="2017-05-24"*/}
                {/*        InputLabelProps={{*/}
                {/*            shrink: true,*/}
                {/*        }}*/}
                {/*        onChange={this.handleDateRangeChange}*/}
                {/*    />*/}
                {/*    Search for status:*/}
                {/*    <Input onChange={this.handleDateRangeChange} name={"status"}/>*/}
                {/*    <Button variant="contained" color="primary" onClick={this.filterTasksByDate}>*/}
                {/*        Search*/}
                {/*    </Button>*/}
                {/*</form>*/}
                {TaskList}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        finishedTask: state.finishedTask.id,
        deletedTask: state.deletedTask.id
    }
}

const mapDispatchToProps = dispatch => {
    return {
        taskDone : () => dispatch({type:actionTypes.TASK_DONE}),
        taskDeleted : () => dispatch({type:actionTypes.TASK_DELETE}),
        requestSuccess : (snackMessage) => dispatch({type:actionTypes.TOGGLE_SNACKBAR,message:snackMessage}),
        requestError   : (snackMessage) => dispatch({type:actionTypes.TOGGLE_SNACKBAR,message:snackMessage,variant:'error'})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);