import React, { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, fetchGetComments } from "../redux/slices/comments";

export const FullPost = () => { 

  const params = useParams()
  
  const dispatch = useDispatch()
  const [data, setData] = React.useState()   
  const [isLoading, setLoading] = React.useState(true)
  const {id} = useParams() 
  const {comments} = useSelector(state => state.comment) 

  const fetchComments = useCallback(async () =>{
    try{ 
      dispatch(fetchGetComments(params.id))

    } catch (err){
      console.log(err); 
      alert('Не удалось загрузить комменты')
    }
  },[params.id, dispatch])

  React.useEffect(()=>{
      

       axios.get(`/posts/${id}`)
       .then((res) => {
        setData(res.data)
        setLoading(false)
        
       })
       
       .catch ((err)=>{
        console.warn(err);
        alert('Ошибка при получение статьи') 
       })
  },[])


  React.useEffect(()=>{
    fetchComments()
  },[fetchComments])
  

  


  if(isLoading) {
    return <Post isLoading={isLoading} isFullPost/>
  }
  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `${process.env.REACT_APP_API_URL}${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.commentsCount}
        comments={data.comments}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text}/>
      </Post>
      <CommentsBlock 
        isLoading={false}
        items={comments} 
        user={data.user}

      >
        <Index user={data.user} />
      </CommentsBlock>
    </>
  );
};
