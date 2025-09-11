import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  access_token: '',
  
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
        // state.name = action.payload.name
        // state.email = action.payload.email
        // state.access_token = action.payload.access_token

        const {name, email, access_token} = action.payload
        

        state.name = name || email
        state.email = email
        state.access_token = access_token
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { updateUser } = userSlice.actions

export default userSlice.reducer