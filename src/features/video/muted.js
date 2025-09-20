import { createSlice } from '@reduxjs/toolkit'
import React from 'react'

const initialState = {value: true}
export const mutedSlice = createSlice({
    name:'mute',
    initialState,
    reducers : {
        toggleMuted: (state, payload)=>{
            state.value = !state.value
        }
    }

})

export const {toggleMuted} = mutedSlice.actions
export const muteReducer = mutedSlice.reducer
