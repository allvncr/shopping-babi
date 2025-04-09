import { defineStore } from 'pinia'
import {
  getActivities,
  fetchActivityBySlug,
  createActivity,
  updateActivityByID,
  deleteActivityByID,
} from 'src/services/activityService'
import { useAuthStore } from './authStore'

export const useActivityStore = defineStore('activity', {
  state: () => ({
    favoris: [], // Liste des favoris
    activities: [], // Liste des établissements
    loading: false, // Indicateur de chargement
    error: null, // Message d'erreur éventuel
    activity: null,
  }),

  actions: {
    async fetchActivities(searchQuery = {}) {
      this.loading = true
      this.error = null
      const authStore = useAuthStore()
      const userID = authStore.user.id

      if (authStore.user.role === 'proprio') {
        searchQuery.createdBy = userID
      }
      this.loading = true
      this.error = null

      try {
        const response = await getActivities(searchQuery) // Appel au service
        this.activities = response.data.activities // Met à jour la liste
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Erreur lors de la récupération des établissements.'
      } finally {
        this.loading = false
      }
    },

    async fetchActivity(id) {
      this.loading = true
      this.error = null

      try {
        const response = await fetchActivityBySlug(id)
        this.activity = response.data.activity
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement des détails.'

        throw this.error
      } finally {
        this.loading = false
      }
    },

    async addActivity(activityData) {
      try {
        await createActivity(useAuthStore().token, activityData)
        this.error = null // Réinitialiser les erreurs
      } catch (err) {
        this.error = err.response?.data?.message || 'Échec de l’inscription. Essayez à nouveau.'
        throw this.error
      }
    },

    async updateActivityByID(activityData) {
      try {
        await updateActivityByID(useAuthStore().token, activityData)
        this.error = null
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'Échec de la mise à jour des informations utilisateur. Essayez à nouveau.'
        throw this.error
      }
    },

    async deleteActivity(ID) {
      try {
        await deleteActivityByID(useAuthStore().token, ID)
        this.error = null
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'Échec de la mise à jour des informations utilisateur. Essayez à nouveau.'
        throw this.error
      }
    },
  },
})
