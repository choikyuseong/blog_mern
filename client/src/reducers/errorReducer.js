import {GET_ERRORS} from "../action/types";

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {   //switch case
        case GET_ERRORS:
            return action.payload;
        default:
            return state;
    }
}