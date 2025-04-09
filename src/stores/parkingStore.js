import { defineStore } from 'pinia'
import {
  fetchParkingBySlug,
  getParkings,
  createParking,
  updateParkingByID,
  deleteParkingByID,
} from 'src/services/parkingService'
import { useAuthStore } from './authStore'

export const useParkingStore = defineStore('parking', {
  state: () => ({
    parking: null,
    parkings: [],
  }),

  actions: {
    async fetchParkings(searchQuery = {}) {
      this.loading = true
      this.error = null
      const authStore = useAuthStore()
      const userID = authStore.user.id

      if (authStore.user.role === 'proprio') {
        searchQuery.createdBy = userID
      }

      try {
        const response = await getParkings(searchQuery) // Appel au service
        this.parkings = response.data.parkings // Met à jour la liste
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Erreur lors de la récupération des établissements.'
      } finally {
        this.loading = false
      }
    },

    async fetchParking(id) {
      this.loading = true
      this.error = null

      try {
        const response = await fetchParkingBySlug(id)
        this.parking = response.data.parking
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement des détails.'

        throw this.error
      } finally {
        this.loading = false
      }
    },

    async addParking(parkingData) {
      try {
        await createParking(useAuthStore().token, parkingData)
        this.error = null // Réinitialiser les erreurs
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Échec de l’ajout du parking. Essayez à nouveau.'
        throw this.error
      }
    },

    async updateParking(parkingData) {
      try {
        await updateParkingByID(useAuthStore().token, parkingData)
        this.error = null
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'Échec de la mise à jour des informations du parking. Essayez à nouveau.'
        throw this.error
      }
    },

    async deleteParking(ID) {
      try {
        await deleteParkingByID(useAuthStore().token, ID)
        this.error = null
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Échec de la suppression du parking. Essayez à nouveau.'
        throw this.error
      }
    },
  },
})
