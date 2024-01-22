import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from '../../axios'
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../../redux/slices/comments";

export const Index = ({user}) => { 
  const dispatch = useDispatch()
  const navigate = useNavigate()  
  const params = useParams()
  const {data} = useSelector(state => state.auth) 
  
  
   

  const [comment, setComment] = React.useState('') 


  const onSubmit = () =>{
    try{
      const postId = params.id
      const user = data.fullName
      
      dispatch(fetchComments({postId, comment, user})) 
      setComment('')
      

      



    } catch (err){ 
      console.log(err);  
      alert('Пожалуйста авторизуйтесь что бы писать комментарие')

    }
  }


  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={user.avatarUrl}
        />
        <div className={styles.form}>
          <form onSubmit={(e)=> e.preventDefault()} action="">
                 <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            onChange={(e)=> setComment(e.target.value)} 
            value={comment}
            multiline
            fullWidth
          />
          <Button type="submit" onClick={onSubmit} variant="contained">Отправить</Button>
          </form>
     
        </div>
      </div>
    </>
  );
};
