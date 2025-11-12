import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  username: '',
  access_token: '',
  isAdmin: false,
  password: '',
  credential: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
        // state.name = action.payload.name
        // state.username = action.payload.username
        // state.access_token = action.payload.access_token

        const {name, username, access_token, isAdmin,password, credential} = action.payload
        

        state.name = name || username
        state.username = username
        state.access_token = access_token
        state.isAdmin = isAdmin
        state.password = password
        state.credential = credential
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { updateUser } = userSlice.actions

export default userSlice.reducer