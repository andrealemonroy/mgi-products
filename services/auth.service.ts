import type { LoginPayload, LoginResponse } from '../types/auth'
import { http } from './http'

export async function loginService(payload: LoginPayload) {
  return await http<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}
