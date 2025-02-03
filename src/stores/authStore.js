import { defineStore } from 'pinia'
import { login, register, updateUser } from 'src/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
    error: null,
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await login(email, password)
        this.token = response.data.token
        this.user = response.data.user // Si l'API retourne des infos utilisateur
        localStorage.setItem('user', JSON.stringify(this.user)) // Stocker le user
        localStorage.setItem('token', JSON.stringify(this.token)) // Stocker le token
        this.error = null // Réinitialiser les erreurs
      } catch (err) {
        this.error = err.response?.data?.message || 'Échec de la connexion. Essayez à nouveau.'
        console.error(err)
      }
    },

    async register(userData) {
      try {
        await register(userData)
        this.error = null // Réinitialiser les erreurs
      } catch (err) {
        this.error = err.response?.data?.message || 'Échec de l’inscription. Essayez à nouveau.'
        console.error(err)
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
        console.error(err)
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
