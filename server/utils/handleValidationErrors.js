import { validationResult } from "express-validator";
export default (req,res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){ // если валидация не прошла
    return res.status(400).json(errors.array());

  } 
  // если успешно
  next(); 
}