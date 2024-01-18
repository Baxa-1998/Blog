import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form';
import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  console.log('auth', isAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: 'Narziyev Baxtiyor',
      email: 'narzievbaxtiyor@gmail.com',
      password: 'baxa1232334',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
   
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      alert('Не удалось зарегистрироваться!');
      if(values.password.length < 5){
        setError('password',{
          type: "custom",
          message: "Пароль должен состоит из 5 символов"
        })
      }
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  
  };
  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
    <form onSubmit={handleSubmit(onSubmit)}>
    <TextField
        error={Boolean(errors.fullName?.message)}
        helperText={errors.fullName?.message}
        {...register('fullName', { required: 'Укажите имя' })}
        className={styles.field}
        label="Полное имя"
        fullWidth
      />
      <TextField
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {...register('email', { required: 'Укажите почту' })}
        className={styles.field}
        label="E-Mail"
        fullWidth
      />
      <TextField
      onChange={()=> setError('password',{
        type: "minLength", 
        message: "Пароль должен быть минимум 5 символов"
      })}
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        {...register('password', { required: 'Введите пароль' })}
        
        // {...setError('password', {required: 'Пароль должен быть минимум 5 символов'})}
        className={styles.field}
        label="Пароль"
        type='password'
        fullWidth
      />
      <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
        Зарегистрироваться
      </Button>
    </form>
    </Paper>
  );
};
