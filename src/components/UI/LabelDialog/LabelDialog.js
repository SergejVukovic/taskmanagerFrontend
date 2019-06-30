import React, {Component} from 'react';
import LabelIcon from '@material-ui/icons/Label';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import {Link}from 'react-router-dom';
import {connect} from 'react-redux';
import * as actionTypes from '../../../store/actions/actions';

class LabelDialog extends Component {

  state = {
      labels : null
  }

  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = (label,taskid) => {
      if (this.props.label){
          this.props.labeladd(label,taskid);
          this.props.onClose(label);
      }else{
          this.props.sharetogroup(label);
          this.props.onClose(label);
      }
  };

  render() {
    const { classes, onClose, selectedValue,label,group, ...other } = this.props;
    const data = label ? this.props.labels : this.props.groups;
    const title = label ? 'Set label to task' : 'Share task with the group';
    const buttonText = label ? 'Add label' : 'Add Group';
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
        <div>
          <List>
            {data ? data.map((label,index) => (
              <ListItem button onClick={() => this.handleListItemClick(label,this.props.taskid)} key={index}>
                <ListItemAvatar>
                  <Avatar>
                    <LabelIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={label.labelTitle || label.name} />
              </ListItem>
            )):
            (<ListItem button key={2}>
            <ListItemAvatar>
              <Avatar>
                <LabelIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Loading your labels..." />
          </ListItem>)}
            <ListItem button component={Link} to="/new-label">
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={buttonText} />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }
}

const mapDispatchToProps = dispatch => {
    return {
        labeladd : (selectedLabel,id) => dispatch({type:actionTypes.LABEL_ADD,label:selectedLabel,taskid:id})
    }
}


export default connect(null,mapDispatchToProps)(LabelDialog);