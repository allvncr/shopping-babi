import { defineStore } from 'pinia'
import {
  login,
  register,
  updateUser,
  getAllUsers,
  updateUserByID,
  deleteUserByID,
} from 'src/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
    error: null,
    users: [],
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await login(email, password)
        this.token = response.data.token
        this.user = response.data.user // Si l'API retourne des infos utilisateur
        localStorage.setItem('user', JSON.stringify(this.user)) // Stocker le user
        localStorage.setItem('token', JSON.stringify(this.token)) // Stocker le token
        if (this.user.role == 'client') {
          this.logout()
        }
        this.error = null // Réinitialiser les erreurs
      } catch (err) {
        this.error = err.response?.data?.message || 'Échec de la connexion. Essayez à nouveau.'
        throw this.error
      }
    },

    async register(userData) {
      try {
        await register(userData)
        this.error = null // Réinitialiser les erreurs
      } catch (err) {
        this.error = err.response?.data?.message || 'Échec de l’inscription. Essayez à nouveau.'
        throw this.error
      }
    },

    async updateUser(userData) {
      try {
        const response = await updateUser(this.token, userData)
        this.user = response.data.user
        localStorage.setItem('user', JSON.stringify(this.user))
        this.error = null
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'Échec de la mise à jour des informations utilisateur. Essayez à nouveau.'
        throw this.error
      }
    },

    async updateUserByID(userData) {
      try {
        await updateUserByID(this.token, userData)
        this.error = null
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'Échec de la mise à jour des informations utilisateur. Essayez à nouveau.'
        throw this.error
      }
    },

    async deleteUserByID(ID) {
      try {
        await deleteUserByID(this.token, ID)
        this.error = null
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'Échec de la mise à jour des informations utilisateur. Essayez à nouveau.'
        throw this.error
      }
    },

    async getAllUsers() {
      try {
        const response = await getAllUsers(this.token)
        this.users = response.data
      } catch (err) {
        this.error = err.message || 'Échec de la récupération des utilisateurs. Essayez à nouveau.'
        this.users = []
        throw this.error
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = '/login'
    },
  },
})
