import React from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { LoginParams } from '../../../api/auth-api'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { setIsLoggedInAC, loggedInTC } from '../auth-reducer'
import { ResultCodes } from '../../../api/todolists-api'
import { Navigate } from 'react-router-dom'
import { selectIsLoggedIn } from '../auth-selectors'

///^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
const EMAIL_REGEXP = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
// ^ - начинать проверять с начала строки; $ - роверять через регулярное выражение до окончания строки.

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password should be 6 or more longs').max(50, 'Too Long!').required('Required'),
})

export const Login = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn)

  const { isSubmitting, getFieldProps, handleSubmit, touched, errors, resetForm } = useFormik<LoginParams>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: async (values) => {
      await dispatch(loggedInTC(values)).then((data) => {
        if (data?.resultCode === ResultCodes.Succeeded) {
          resetForm()
        }
      })
    },
    validationSchema,
    // validate: (values) => {
    //   const errors: Partial<FormData> = {} //Partial - утилитный тип в typescript, который принимает в дженерик тип, и делает все его поля опциональными (не обязательными)
    //
    //   if (!values.email) {
    //     errors.email = 'Required'
    //   } else if (!EMAIL_REGEXP.test(values.email)) {
    //     errors.email = 'Invalid email address'
    //   }
    //
    //   if (!values.password) {
    //     errors.password = 'Required'
    //   } else if (values.password.length < 6) {
    //     errors.password = 'Password should be 6 or more longs'
    //   }
    //
    //   return errors
    // },
  })

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid item justifyContent={'center'}>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" {...getFieldProps('email')} />
              {touched.email && errors.email && <p style={{ color: 'tomato', margin: 0 }}>{errors.email}</p>}
              <TextField type="password" label="Password" margin="normal" {...getFieldProps('password')} />
              {touched.password && errors.password && <p style={{ color: 'tomato', margin: 0 }}>{errors.password}</p>}
              <FormControlLabel label={'Remember me'} control={<Checkbox {...getFieldProps('rememberMe')} />} />
              <Button type={'submit'} variant={'contained'} color={'primary'} disabled={isSubmitting}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
