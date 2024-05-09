import React, { useEffect } from 'react'
import './App.css'
import { TodolistsList } from '../features/TodolistsList/TodolistsList'
import { useAppDispatch, useAppSelector } from './store'
import { isInitializeAppTC, RequestStatusType } from './app-reducer'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import { Menu } from '@mui/icons-material'
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnackbar'
import { createBrowserRouter, Navigate, Route, RouterProvider, Routes } from 'react-router-dom'
import { Login } from '../features/auth/Login/Login'
import { ErrorPage } from '../components/ErrorPage/ErrorPage'
import { CircularProgress } from '@mui/material'
import { selectIsLoggedIn } from '../features/auth/auth-selectors'
import { logoutTC } from '../features/auth/auth-reducer'

const router = createBrowserRouter([
  {
    path: '/',
    element: <TodolistsList />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <Navigate to={'/404'} />,
  },
  {
    path: '/404',
    element: <h1>404: file not found</h1>,
  },
])

function App() {
  const status = useAppSelector<RequestStatusType>((state) => state.app.status)

  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector((state) => state.app.isInitialized)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  useEffect(() => {
    dispatch(isInitializeAppTC())
  }, [])

  const handleLogoutButtonClick = () => {
    dispatch(logoutTC())
  }

  if (!isInitialized) {
    return (
      <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color={'inherit'} onClick={handleLogoutButtonClick}>
              Log out
            </Button>
          )}
        </Toolbar>
        {status === 'loading' && <LinearProgress />}
      </AppBar>
      <Container fixed>
        {/*<TodolistsList />*/}
        <RouterProvider router={router} />
      </Container>
    </div>
  )
}

export default App
