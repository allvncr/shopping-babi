import { api } from 'boot/axios'

export const login = async (email, password) => {
  return await api.post('auth/login', { email, password })
}

export const register = async (userData) => {
  return await api.post('auth/register', userData)
}

export const updateUser = async (token, userData) => {
  return await api.put('auth/update', userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
