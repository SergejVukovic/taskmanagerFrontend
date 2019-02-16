import React,{Component} from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done'
import Chip from '@material-ui/core/Chip';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

import {connect} from 'react-redux';
import axios from 'axios';
import * as actionTypes from '../../store/actions/actions';

import LabelDialog from '../../components/UI/LabelDialog/LabelDialog';

class TaskCard extends Component {

    state = {
        dialogOpen : false,
        tasklabels : [],
        newLabelId : null
    }

    componentDidMount(){
        this.setState({tasklabels : this.props.tasklabels})
    }

    componentDidUpdate(){
        if(this.props.newLabel.add && this.props.taskid === this.props.newLabel.taskid){
            this.handleLabelAdd(this.props.newLabel.label);
        }
    }

    handleDialogOpen = () => {
        this.setState({dialogOpen:true});
    }
    handleDialogClose = () => {
        this.setState({dialogOpen:false});
    }
    
    handleLabelAdd = (label) => {
        this.setState({
            ...this.state,
            tasklabels:[...this.state.tasklabels,label],
        });
        this.props.newLabelAdded();
        axios.post('/api/task/addlabel',{
            tasks_id:this.props.newLabel.taskid,
            labels_id:this.props.newLabel.label.id
        })
        .then(response => this.props.requestSuccess(response.data.message))
        .catch(error => this.props.requestError(error.response.data.message));
    }

    handleLabelDelete = (taskid,labelid) => {
        this.state.tasklabels.map(label => {
            if(labelid === label.id)
            {
                this.setState(state => {
                    const labels = [...state.tasklabels];
                    const labelToDelete = labels.indexOf(label);
                    labels.splice(labelToDelete, 1);
                    return { 
                        ...state,
                        tasklabels: labels 
                    };
                  });

                  axios.post('/api/task/removelabel',{
                    tasks_id  : taskid,
                    labels_id : labelid
                })
                .then(response => this.props.requestSuccess(response.data.message))
                .catch(error => this.props.requestError(error.response.data.message));
            }
            return label;
        })
    }

    render () {
        
        let Labels = this.state.tasklabels.map((label,index) => (
        <Chip
        label={label.label_title}
        component="a"
        key = {index}
        color="secondary" onDelete={() => this.handleLabelDelete(this.props.taskid,label.id)} variant="outlined"
        style = {{margin:5}}
        />))
        
        return (
            <Card style={styles.card}>
            <CardContent>

                <h2>{this.props.title}</h2>
                  
                <h4>{this.props.description}</h4>

            <div>{Labels}</div>
            </CardContent>
            <CardActions style={styles.addLabelButtonHolder}>
                <Button variant="fab" color="primary" aria-label="Add" mini onClick={this.handleDialogOpen}>
                    <AddIcon />
                </Button>
                <Button style={styles.markAsDoneButton} variant="fab" color="primary" aria-label="Add" mini onClick={() => this.props.taskDone(this.props.taskid)}>
                    <DoneIcon />
                </Button>
                <Button style={styles.removeTaskButton} variant="fab" color="primary" aria-label="Add" mini onClick={() => this.props.taskDelete(this.props.taskid)}>
                    <DeleteIcon />
                </Button>
            </CardActions>
            <LabelDialog 
            open={this.state.dialogOpen}
            labels = {this.props.labels}
            onClose = {this.handleDialogClose}
            taskid = {this.props.taskid}
            />
          </Card>
        )
    }
}

const styles = {
    card: {
      minWidth: 275,
      width:'40%',
      margin : 'auto',
      marginTop : 20
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    addLabelButtonHolder : {
        float : 'right'
    },
    removeTaskButton :{
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[500],
        },
    },
    markAsDoneButton :{
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[500],
        },
    } 
};

  const mapStateToProps = state => {
      return {
          newLabel : state.labelAdd
      }
  }

  const mapDispatchToProps = dispatch => {
      return {
          newLabelAdded : ()=>dispatch({type:actionTypes.LABEL_ADDED}),
          requestSuccess : (snackMessage) => dispatch({type:actionTypes.TOGGLE_SNACKBAR,message:snackMessage}),
          requestError   : (snackMessage) => dispatch({type:actionTypes.TOGGLE_SNACKBAR,message:snackMessage,variant:'error'}),
          taskDelete : (taskid) => dispatch({type:actionTypes.TASK_DELETE,id:taskid}),
          taskDone : (taskid) => dispatch({type:actionTypes.TASK_DONE,id:taskid})
      }
  }

  export default connect(mapStateToProps,mapDispatchToProps)(TaskCard);