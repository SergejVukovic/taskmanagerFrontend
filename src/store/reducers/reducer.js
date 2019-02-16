import * as actionTypes from '../actions/actions';

const initialState = {
    isAuth : localStorage.authToken ? true : false,
    snackbar : {
        open : false,
        message : '',
        variant : 'success'
    },
    labelAdd : {
        added : false,
        label : false,
        taskid:false
    },
    deletedTask : {
        id:null,
    },
    finishedTask : {
        id:null,
    }
}

const reducer = (state = initialState,action) => {

        switch(action.type){

            case(actionTypes.AUTHENTICATED):
                return {
                    ...state,
                    isAuth : true
                }
            case(actionTypes.LOGOUT):
                return{
                    ...state,
                    isAuth:false
                }
            case(actionTypes.TOGGLE_SNACKBAR):
                return{
                    ...state,
                    snackbar : {
                        open : !state.snackbar.open,
                        message : action.message,
                        variant : action.variant || state.snackbar.variant
                    }
                }
            case(actionTypes.LABEL_ADD):
                return{
                    ...state,
                    labelAdd : {
                        add : true,
                        label : action.label,
                        taskid : action.taskid,
                    }   
                }
            case(actionTypes.LABEL_ADDED):
                return{
                    ...state,
                    labelAdd : {
                        add : false,
                        label : false,
                        taskid : false
                    }
                }
            case(actionTypes.TASK_DELETE):
                return{
                    ...state,
                    deletedTask : {
                        id : action.id || null
                    }
                }
            case(actionTypes.TASK_DONE):
                return {
                    ...state,
                    finishedTask : {
                        id:action.id || null
                    }
                }
            default : 
                return state;
        }
    
}

export default reducer;