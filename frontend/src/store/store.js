import {configureStore} from '@reduxjs/toolkit'

import userReducer from './userStore'
import mailReducer from './mailStore'
import credentialsReducer from './mailpass'
export const store = configureStore({
    reducer: {
        user: userReducer,
        mail : mailReducer,
        credentials : credentialsReducer
    }   
})