import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currUser:null,
    err:null,
    loading:false,
    clientSecret:null
}

const userSlice = createSlice({
    name:'user_mod',
    initialState,
    reducers: {
        beginingSignin: (state) => {
            state.loading = true;
        },

        signInSuccess: (state,action) => {
                state.currUser = action.payload;
                state.loading = false;
                state.err = null;
        },
        FailedSign: (state,action) => {
            state.err = action.payload;
            state.loading = false;
        },
        setClientSecret: (state,action) => {
            state.clientSecret = action.payload;
        },
        signOutUserStart: (state) => {
            state.loading = true;
          },
          deleteUserSuccess: (state) => {
            state.currUser = null;
            state.clientSecret= null;
            state.loading = false;
            state.err = null;
          },
          deleteUserFailure: (state, action) => {
            state.err = action.payload;
            state.loading = false;
          },

    }
});

export const {signInSuccess,beginingSignin,FailedSign,setClientSecret, signOutUserStart,deleteUserSuccess,deleteUserFailure} = userSlice.actions;

export default userSlice.reducer;