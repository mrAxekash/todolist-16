import { Dispatch } from 'redux'
import { authApi } from '../api/auth-api'
import { ResultCodes } from '../api/todolists-api'
import { setIsLoggedInAC } from '../features/auth/auth-reducer'
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils'

const initialState: InitialStateType = {
  status: 'idle',
  error: null,
  isInitialized: false,
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return { ...state, status: action.status }
    case 'APP/SET-ERROR':
      return { ...state, error: action.error }
    case 'APP/SET-IS-INITIALIZED':
      return { ...state, isInitialized: action.isInitialized }
    default:
      return { ...state }
  }
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  isInitialized: boolean
}

export const setAppErrorAC = (error: string | null) => ({ type: 'APP/SET-ERROR', error }) as const
export const setAppStatusAC = (status: RequestStatusType) => ({ type: 'APP/SET-STATUS', status }) as const

export const setAppInitializedAC = (isInitialized: boolean) => {
  return {
    type: 'APP/SET-IS-INITIALIZED',
    isInitialized,
  } as const
}
export const isInitializeAppTC = () => async (dispatch: Dispatch) => {
  try {
    const res = await authApi.me()
    if (res.data.resultCode === ResultCodes.Succeeded) {
      dispatch(setIsLoggedInAC(true))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    handleServerNetworkError(e as Error, dispatch)
  } finally {
    dispatch(setAppInitializedAC(true))
  }
}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type IsInitializedActionType = ReturnType<typeof setAppInitializedAC>

type ActionsType = SetAppErrorActionType | SetAppStatusActionType | IsInitializedActionType
