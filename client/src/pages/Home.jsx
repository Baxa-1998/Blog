import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularPosts, fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => { 
  const dispatch = useDispatch()
  const userData = useSelector((state)=> state.auth.data)
  const [popularActive, setPopularActive] = React.useState(true) 
  const {posts,tags,popularPosts} = useSelector(state => state.posts) 
 
  const isPostLoading = posts.status === 'loading' 
  const isTagLoading = tags.status === "loading"
  console.log(tags);

  React.useEffect(()=>{
  dispatch(fetchPosts())
  dispatch(fetchTags())
  dispatch(fetchPopularPosts())



  },[])
  console.log(popularPosts);

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
              imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags} 
             
              isEditable={userData?._id === obj.user?._id}
            /> )}
        </Grid> 
        :       <Grid xs={8} item>
        {(isPostLoading ? [...Array(5)]: popularPosts.items).map((obj,index) => isPostLoading ? <Post key={index} isLoading={true}/> :  <Post
            id={obj._id}
            title={obj.title}
            imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
            user={obj.user}
            createdAt={obj.createdAt}
            viewsCount={obj.viewsCount}
            commentsCount={3}
            tags={obj.tags} 
           
            isEditable={userData?._id === obj.user?._id}
          /> )}
      </Grid> }
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
