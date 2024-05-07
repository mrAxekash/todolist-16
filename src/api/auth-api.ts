import { instance, ResponseType } from './todolists-api'

export const authApi = {
  login(params: LoginParams) {
    return instance.post<ResponseType<{ userId: number }>>('/auth/login', params)
  },
  me() {
    return instance.get<ResponseType<User>>('/auth/me')
  },
}

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type User = {
  id: number
  email: string
  login: string
}
