import mongoose from "mongoose"; 

const CommentScheme = new mongoose.Schema({
  comment: {
    type: String, 
    required: true
  },
  user: {
    type: String,
    ref: 'User',
    

  },
  avatarUrl: String, 
},

  {
    timestamps: true
  }
 
);
export default mongoose.model('Comment', CommentScheme);