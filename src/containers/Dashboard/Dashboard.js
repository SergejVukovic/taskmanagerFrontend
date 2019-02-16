import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actions';

import TaskCard from '../TaskCard/TaskCard';

class Dashboard extends Component {

    state = {
        tasks: false,
        allUserLabels: null
    }

    componentDidMount() {
        //If token is expired and user dose not relode the page have to set Auth header again
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.authToken}`;

        axios.get('/api/task')
            .then(response => {
                this.setState({ tasks: response.data })
            })
            .catch(error => {
                localStorage.removeItem('authToken');
                this.props.history.push('/login');
            });

        axios.get('api/label')
            .then(response => this.setState({ allUserLabels: response.data }))
            .catch(error => {
                localStorage.removeItem('authToken');
                this.props.history.push('/login');
            });

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
                axios.get(`/api/task/done/${this.props.finishedTask}`)
                .then(response => this.props.requestSuccess(response.data.message))
                .catch(error => this.props.requestError(error.response.data.message))
                this.props.taskDone();
            }else if(this.props.deletedTask){
                axios.delete(`/api/task/${this.props.deletedTask}`)
                .then(response => this.props.requestSuccess(response.data.message))
                .catch(error => this.props.requestError(error.response.data.message));
                this.props.taskDeleted();
            }
            
        }
    }

    render() {

        let TaskList = null;

        if (this.state.tasks && this.state.allUserLabels) {
            TaskList = this.state.tasks.map(task => {
                return (
                    <TaskCard
                        key={task.id}
                        taskid={task.id}
                        title={task.task_title}
                        description={task.task_description}
                        tasklabels={task.labels}
                        labels={this.state.allUserLabels}
                    />
                )
            })
        }

        return (
            <div>
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