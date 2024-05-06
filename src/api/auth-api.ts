import { instance, ResponseType } from './todolists-api'

export const authApi = {
  login(params: LoginParams) {
    return instance.post<ResponseType<{ userId: number }>>('/auth/login', params)
  },
}

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}
