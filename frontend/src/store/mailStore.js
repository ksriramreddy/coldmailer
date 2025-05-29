import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    content : null
}
const mailSlice = createSlice({
    name : "mail",
    initialState,
    reducers: {
        setMailContent: (state, action) => {
            state.content = action.payload;
        },
        clearMailContent: (state) => {
            state.content = null;
        }
    }
})

export const { setMailContent, clearMailContent } = mailSlice.actions;
export default mailSlice.reducer;