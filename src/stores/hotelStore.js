import { defineStore } from 'pinia'
import {
  fetchHotelBySlug,
  getHotels,
  createHotel,
  updateHotelByID,
  deleteHotelByID,
} from 'src/services/hotelService'
import { useAuthStore } from './authStore'

export const useHotelStore = defineStore('hotel', {
  state: () => ({
    hotel: null,
    hotels: [],
  }),

  actions: {
    async fetchHotels(searchQuery = {}) {
      this.loading = true
      this.error = null
      const authStore = useAuthStore()
      const userID = authStore.user.id

      if (authStore.user.role === 'proprio') {
        searchQuery.createdBy = userID
      }

      try {
        const response = await getHotels(searchQuery) // Appel au service
        this.hotels = response.data.hotels // Met à jour la liste
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Erreur lors de la récupération des établissements.'
      } finally {
        this.loading = false
      }
    },

    async fetchHotel(id) {
      this.loading = true
      this.error = null

      try {
        const response = await fetchHotelBySlug(id)
        this.hotel = response.data.hotel
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement des détails.'

        throw this.error
      } finally {
        this.loading = false
      }
    },

    async addHotel(hotelData) {
      try {
        await createHotel(useAuthStore().token, hotelData)
        this.error = null // Réinitialiser les erreurs
      } catch (err) {
        this.error = err.response?.data?.message || 'Échec de l’ajout du hotel. Essayez à nouveau.'
        throw this.error
      }
    },

    async updateHotel(hotelData) {
      try {
        await updateHotelByID(useAuthStore().token, hotelData)
        this.error = null
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'Échec de la mise à jour des informations du hotel. Essayez à nouveau.'
        throw this.error
      }
    },

    async deleteHotel(ID) {
      try {
        await deleteHotelByID(useAuthStore().token, ID)
        this.error = null
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Échec de la suppression du hotel. Essayez à nouveau.'
        throw this.error
      }
    },
  },
})
