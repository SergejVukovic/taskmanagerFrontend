import React, {useEffect, useState} from 'react';
import axios from 'axios';

import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import TrashIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {Divider, Paper, Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.background,
        marginLeft : '25%',
        marginTop: '2%'
    },
    inline: {
        display: 'inline',
    },
}));


const Groups = () => {
    const classes = useStyles();
    const [groups, setGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);

    useEffect( () => {
         axios.get('/api/groups').then(response => {
             if (response && response.data) {
                 setGroups(response.data);
             }
         });
    }, []);

    useEffect(() => {
        axios.get('/api/groups/user').then(response=>{
            if(response && response.data){
                setJoinedGroups(response.data);
            }
        })
    },[]);

    const addUserToGroup = (groupId) => {
        axios.post('/api/groups/adduser', {
            groups_id : groupId
        }).then( () => {
            const filteredGroups = groups.filter(group => group.id !== groupId);
            setGroups(filteredGroups);
            const removedGroup = groups.filter(group => group.id === groupId);
            setJoinedGroups([...joinedGroups, ...removedGroup])
        })
    };

    const removeUserFromGroup = (groupId) => {
        axios.post('/api/groups/removeuser', {
            "groups_id" : groupId,
        }).then(()=>{
            const filtererJoinedGroups = joinedGroups.filter(group => group.id !== groupId);
            setJoinedGroups(filtererJoinedGroups);
            const removedGroup = joinedGroups.filter(group => group.id === groupId);
            setGroups([...groups, ...removedGroup])
        })
    };

    return (
       <div style={{display:'flex'}}>
        <Paper style={{ width: '50%', marginTop: '5%', alignContent: 'left', padding: '5%' }}>
            <Typography variant='h4'>Groups you can join</Typography>
            <Divider/>
            <List className={classes.root}>
                {groups.map(group => (
                        <ListItem key={group.id}>
                            <ListItemText primary={group.name} secondary={group.description} />
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => addUserToGroup(group.id)} edge="end" aria-label="Comments">
                                    <AddIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                )}
            </List>
        </Paper>
        <Paper style={{ width: '50%', marginTop: '5%', alignContent: 'right', padding: '5%' }}>
            <Typography variant='h4'>Groups you are already member</Typography>
            <Divider/>
        <List className={classes.root}>
        {joinedGroups.map(group => (
                    <ListItem key={group.id}>
                        <ListItemText primary={group.name} secondary={group.description} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => removeUserFromGroup(group.id)} edge="end" aria-label="Comments">
                                <TrashIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            )}
        </List>
        </Paper>
       </div>
    )
};

export default Groups;