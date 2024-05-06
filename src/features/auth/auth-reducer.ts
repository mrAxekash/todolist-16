import { Dispatch } from 'redux'
import { authApi, LoginParams } from '../../api/auth-api'
import { SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from '../../app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'
import { ResultCodes } from '../../api/todolists-api'

type InitialStateType = typeof initialState

const initialState = {
  isLoggedIn: false,
}
export const authReducer = (state: InitialStateType = initialState, action: LoginActionType) => {
  switch (action.type) {
    case 'login/SET-IS-LOGGED-IN':
      return { ...state, isLoggedIn: action.IsLoggedIn }
    default:
      return state
  }
}

export const setIsLoggedInAC = (IsLoggedIn: boolean) => {
  return {
    type: 'login/SET-IS-LOGGED-IN' as const,
    IsLoggedIn,
  }
}

export const loggedInTC = (data: LoginParams) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  try {
    const res = await authApi.login(data)
    if (res.data.resultCode === ResultCodes.Succeeded) {
      dispatch(setIsLoggedInAC(true))
      dispatch(setAppStatusAC('succeeded'))
    } else {
      handleServerAppError(res.data, dispatch)
      return res.data
    }
  } catch (e) {
    handleServerNetworkError(e as Error, dispatch)
  }
}

type LoginActionType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType
