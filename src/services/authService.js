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

export const getAllUsers = async (token) => {
  return await api.get('auth/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const updateUserByID = async (token, userData) => {
  return await api.patch('auth/users/' + userData.id, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const deleteUserByID = async (token, ID) => {
  return await api.delete('auth/users/' + ID, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
