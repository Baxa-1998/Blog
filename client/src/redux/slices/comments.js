import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios'



export const fetchComments = createAsyncThunk('comment/fetchComments', async ({postId,comment, user}) =>{
  
 try{
  // console.log('request payload', {postId, comment, user});
  const {data} = await axios.post(`/comment/${postId}`, {
    postId, 
    comment, 
    user
    
  })  
  return data
 } catch (err){
  console.log(err);
 } 
  

})

export const fetchGetComments = createAsyncThunk('fetchGetComments', async (postId)=>{
  const {data} = await axios.get(`posts/comment/${postId}`) 
  return data
})


export const fetchLastComments = createAsyncThunk('fetchLastComments', async () =>{
  const {data} = await axios.get('/comment') 
  return data
})



const initialState = {
  comments: [],  
  lastComments: [],
  status: "loading"

}





const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {}, 
  extraReducers:{
    [fetchComments.pending]: (state) =>{
      state.status =  'loading';
     
  
    }, 
    [fetchComments.fulfilled]: (state,action) =>{
      state.status = 'loaded';
      state.comments.push(action.payload)
     
    }, 
    [fetchComments.rejected]: (state) =>{
      state.status = 'error';
     
    

    },  

    // получение популярных комментов 
    [fetchLastComments.pending]: (state) =>{
      state.lastComments =  []
      state.status =  'loading'; 
      
  
    }, 
    [fetchLastComments.fulfilled]: (state,action) =>{
      state.status = 'loaded';
      state.lastComments = action.payload
     
    }, 
    [fetchLastComments.rejected]: (state) =>{
      state.lastComments =  []
      state.status = 'error';
    

    

    },  

    // 
    [fetchGetComments.pending]: (state) =>{
      state.status =  'loading';
     
    }, 
    [fetchGetComments.fulfilled]: (state,action) =>{
      state.status = 'loaded';
      state.comments = action.payload
     
    }, 
    [fetchGetComments.rejected]: (state) =>{
      state.status = 'error';
    

    },  
  }

})


export const commentReducer = commentSlice.reducer
