// import { TEST_DISPATCH} from "../action/types";
import isEmpty from '../validation/is-empty';
import { SET_CURRENT_USER} from "../action/types";

const initialState = {
    isAuthenticated: false,
    user:{}

};

export default function(state = initialState, action) {
    switch (action.type) {   //switch case
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        // case TEST_DISPATCH:
        //     return {
        //         ...state,
        //         user:action.payload
        //     };
        default:
            return state;
    }
}