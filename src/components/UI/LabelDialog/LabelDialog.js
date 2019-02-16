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
    this.props.labeladd(label,taskid);
    this.props.onClose(label);
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Set label for task</DialogTitle>
        <div>
          <List>
            {this.props.labels ? this.props.labels.map((label,index) => (
              <ListItem button onClick={() => this.handleListItemClick(label,this.props.taskid)} key={index}>
                <ListItemAvatar>
                  <Avatar>
                    <LabelIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={label.label_title} />
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
              <ListItemText primary="add label" />
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