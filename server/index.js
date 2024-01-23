import express, { json } from "express" 
import fs from 'fs'
import mongoose from "mongoose" 
import multer from "multer"
import cors from 'cors'


import {handleValidationErrors, chekcAuth} from "./utils/index.js"


import {PostController, UserController} from './controllers/index.js'


import { registerValidator, loginValidator, postCreateValidation } from "./validation.js"

// process.env.MONGODB_URI // prod url
mongoose.connect(process.env.MONGODB_URI)

.then(()=> console.log('DB ok'))
.catch((err) => console.log('DB', err))

const app = express()  

const storage = multer.diskStorage({
  destination: (_, __, cb) =>{
    if(!fs.existsSync('uploads')){
      fs.mkdirSync('uploads')
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) =>{
    cb(null, file.originalname);
  },
})

const upload = multer({storage});

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

// поиск существующий пользователей
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login)


app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register )

app.get('/auth/me', chekcAuth, UserController.getMe)

app.post(`/upload`, chekcAuth, upload.single('image'), (req,res)=>{
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.get('/tags', PostController.getLastTags)

// получить все статьи 
app.get('/posts', PostController.getAll)
app.get('/comment', PostController.getLastComments)
//  получаем тэги
app.get('/posts/tags', PostController.getLastTags) 


// получить одну статью 
app.get('/posts/:id', PostController.getOne);

// получить популярные статьи
app.get('/popular', PostController.getPopular)

// создание статьи
app.post('/posts', chekcAuth,  postCreateValidation, handleValidationErrors, PostController.create) 

// создание комментария 
app.post('/comment/:id', chekcAuth, PostController.createComment) 





// удаление статьи 
app.delete('/posts/:id', chekcAuth, PostController.remove)

// получить все комментарие 
app.get('/posts/comment/:id', chekcAuth, PostController.getComments)

// обновление статьи 
app.patch('/posts/:id',chekcAuth, postCreateValidation, handleValidationErrors, PostController.update)


// порт который нужно слушать
app.listen(process.env.PORT || 4444, (err)=> {
  if(err) { 
    return console.log(err);
  }
  console.log("Server OK");
})



