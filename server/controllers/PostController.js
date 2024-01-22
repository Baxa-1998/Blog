import PostModel from '../models/Post.js' 
import CommentModel from '../models/Comment.js'


export const getLastTags = async (req,res) =>{
  try{
    const posts = await PostModel.find().limit(5).exec()

    const tags = posts.map(obj => obj.tags).flat().slice(0,5)

    res.json(tags)



  }
   catch (err){
    console.log(err);
    res.status(500) .json({
      message: 'Не удалось получить все статьи'
    })
    
  }

}

export const getLastComments = async (req,res) =>{
  try{ 

    const comments = await CommentModel.find().limit(5).exec() 
    const lastComments = comments.map(com=> com.comment)
   res.json(lastComments)
    
    


  } catch (err){
    console.log(err); 
    res.status(500) .json({
      message: 'Не удалось получить популярные комменты'
    })  
  }
} 


export const getAll = async (req,res) =>{
  try{
    const posts = await PostModel.find().populate("user").exec()

    res.json(posts)



  }
   catch (err){
    console.log(err);
    res.status(500) .json({
      message: 'Не удалось получить все статьи'
    })
    
  }
}

export const getPopular = async (req,res) =>{
  try{
    const popular = await PostModel.find().sort({viewsCount: -1}).populate('user').exec() 
    res.json(popular)

  } catch (err){
    console.log(err);
    res.status(500) .json({
      message: 'Не удалось получить популярные статьи'
    })

  }
}


export const getOne = async (req, res) => {
  try {
  const postId = req.params.id
  
  PostModel.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: { viewsCount: 1 },
    },
    {
      returnDocument: "after",
    }
  ).populate('user').exec().then((doc, err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Can't get article.",
      });
    }

    if (!doc) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    res.json(doc);
  })
  } catch (error) {
  console.log(error)
  res.status(500).json({
  messgae: 'не удалось получить статью',
  })
  }
  }


  export const remove = (req, res) => {
    try {
    const postId = req.params.id
    
    PostModel.findOneAndDelete(
    {
    _id: postId,
    }
    ).then((post) => {
    if (!post) {
    return res.status(404).json({
    message: 'статьтя не найдена',
    })
    } 
    
    res.json({
      success: true,
    })
    })
    } catch (error) {
    console.log(error)
    res.status(500).json({
    messgae: 'не удалось удалить статью статью',
    })
    }
    }


export const createComment = async (req, res) =>{
  try{
    // const user = await UserModel.findById(req.userId);
    const {postId,comment,user} = req.body
    
    
  


    if(!comment) 
      return res.json({message: "Коммент не может быть пустым"})

    const newComment = new CommentModel({comment,user})
    await newComment.save() 
    try{ 
    
      await PostModel.findByIdAndUpdate(postId,{
        $push: {comments: newComment._id},
        
       
      }).populate('user').exec() 


    } catch (err){
      console.log(err);
      res.status(500) .json({
        message: 'Не удалось создать коммент'
      })
      
    }

    res.json(newComment)


  } catch (err){ 
    console.log(err);
    res.status(500) .json({
      message: 'Не удалось создать коммент'
    })
     
  }
    
  }


export const getComments = async (req,res) =>{
  try{ 
      const post = await PostModel.findById(req.params.id)
      const list = await Promise.all(
        post.comments.map((comment)=>{
          return CommentModel.findById(comment)
        })
      )
      res.json(list)

  } catch (err){
    console.log(err); 
    res.status(500) .json({
      message: 'Не удалось получить комменты'
    })

  }

}




export const create = async (req, res) =>{
  try{
    const doc = new PostModel({
      title: req.body.title, 
      text: req.body.text, 
      imageUrl: req.body.imageUrl, 
      tags: req.body.tags.split(','), 
      user: req.userId, 
    })
    const post = await doc.save() 
    res.json(post)

  } catch (err){
    console.log(err);
    res.status(500) .json({
      message: 'Не удалось создать статью'
    })
     
  }
}

export const update = async (req,res) => {
  try{
    const postId = req.params.id
   await PostModel.updateOne({
      _id: postId,
    },
     {
      title: req.body.title, 
      text: req.body.text, 
      imageUrl: req.body.imageUrl, 
      tags: req.body.tags.split(','), 
      user: req.userId, 

    },
    )
    res.json({
      success: true
    })


  } catch (error) {
    console.log(error)
    res.status(500).json({
    messgae: 'не удалось обновить статью',
    })
    }

}


