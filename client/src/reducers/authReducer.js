const initialState = {
    isAuthenticated: false,
    user:{}

};

export default function(state = initialState, action) {
    switch (action.type) {   //switch case
        default:
            return state;
    }
}