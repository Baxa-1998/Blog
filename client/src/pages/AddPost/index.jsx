import React, { useRef } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios'
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export const AddPost = () => { 

  const {id} = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [tags, setTags] = React.useState('');
  const inputRef = useRef(null)
  const isAuth = useSelector(selectIsAuth);
  const [imageUrl, setImgUrl] = React.useState('')
  const [text, setText] = React.useState('');
  const isEditing = Boolean(id)


  const handleChangeFile = async (event) => {
    try{
      const formData = new FormData();
      const file = event.target.files[0]
      formData.append('image', file)
      const {data} = await axios.post('/upload', formData) 
      setImgUrl(data.url)
      console.log(data);

    } catch(error){
      console.warn(error) 
      alert('Ошибка при загрузке файла!')

    }
  };

  const onClickRemoveImage = () => {
    if(window.confirm('Вы хотите удалить превью?')){
      setImgUrl('')
    }
    
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit  = async () =>{
    try{
      setLoading(true)
      const fields = {
        title, 
        text,
        imageUrl, 
        tags
      }
      
      const {data} = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields)
      const _id = isEditing ? id : data._id
      navigate(`/posts/${_id}`)
      
    } catch (error){
      console.warn(error) 
      alert('Ошибка при создание статьи!')
      
    }

  }
  React.useEffect(()=>{
    if(id){
      axios.get(`/posts/${id}`).then(({data})=>{
        setTitle(data.title); 
        setText(data.text); 
        setTags(data.tags.join(',')); 
        setImgUrl(data.imageUrl);
      })
    }
  },[])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  console.log({title,tags,text});

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={()=> inputRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>   <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
           <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </> 
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Заголовок статьи..."
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
        {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
