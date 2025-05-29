import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user: JSON.parse(localStorage.getItem('coldmailerUser')) || null,
}

const userSlice  = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            localStorage.setItem('coldmailerUser', JSON.stringify(action.payload))
        },
        clearUser: (state) => {
            state.user = null
            localStorage.removeItem('coldmailerUser')
        }
    }
})

export const {setUser, clearUser} = userSlice.actions

export default userSlice.reducer