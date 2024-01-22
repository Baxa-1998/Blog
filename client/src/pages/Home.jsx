import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularPosts, fetchPosts, fetchTags } from '../redux/slices/posts'; 
import { fetchComments, fetchLastComments } from '../redux/slices/comments'; 
import style from './Home.module.scss'


export const Home = () => { 
  const dispatch = useDispatch()
  const userData = useSelector((state)=> state.auth.data)
  const [popularActive, setPopularActive] = React.useState(true) 
  const {posts,tags,popularPosts} = useSelector(state => state.posts)  
  const {lastComments} = useSelector(state => state.comment)
  console.log(lastComments);
  

  

 
  const isPostLoading = posts.status === 'loading' 
  const isTagLoading = tags.status === "loading"


  React.useEffect(()=>{
  dispatch(fetchPosts())
  dispatch(fetchTags())
  dispatch(fetchPopularPosts())  
  dispatch(fetchLastComments())
  
  



  },[])

  

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={popularActive ? 0 : 1} aria-label="basic tabs example">
        <Tab onClick={()=> setPopularActive(true)} label="Новые" />
        <Tab  onClick={()=> setPopularActive(false)} label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
          {popularActive ?   
           <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)]: posts.items).map((obj,index) => isPostLoading ? <Post key={index} isLoading={true}/> :  <Post
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `https://blog-sever-ezqp.onrender.com${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount} 
              comments = {obj.comments} 
              commentsCount={obj.commentsCount}
              tags={obj.tags} 

             
              isEditable={userData?._id === obj.user?._id}
            /> )}
        </Grid> 
        :       <Grid xs={8} item>
        {(isPostLoading ? [...Array(5)]: popularPosts.items).map((obj,index) => isPostLoading ? <Post key={index} isLoading={true}/> :  <Post
            id={obj._id}
            title={obj.title}
            imageUrl={obj.imageUrl ? `https://blog-sever-ezqp.onrender.com${obj.imageUrl}` : ''}
            user={obj.user}
            createdAt={obj.createdAt}
            viewsCount={obj.viewsCount}
            commentsCount={3}
            comments = {obj.comments} 
            tags={obj.tags} 
            isEditable={userData?._id === obj.user?._id}
          /> )}
      </Grid> }
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagLoading} /> 
           
          <div className={style.comments_section}>
            <h1>Комментарий</h1>
          <div>{lastComments.map(item => (
            <p>{item}</p>
          ))}</div>

          </div>
    
          
       
        </Grid>
      </Grid>
    </>
  );
};
