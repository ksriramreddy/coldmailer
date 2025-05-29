import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    credentials : null
}

const credentialsSlice = createSlice({
    name: "credentials",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.credentials = action.payload;
        },
        clearCredentials: (state) => {
            state.credentials = null;
        }
    }
})

export const { setCredentials, clearCredentials } = credentialsSlice.actions;
export default credentialsSlice.reducer;