import type { LoginPayload, LoginResponse } from '@models/auth'
import { http } from '@services/http'

export async function loginService(payload: LoginPayload) {
  return await http<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}
