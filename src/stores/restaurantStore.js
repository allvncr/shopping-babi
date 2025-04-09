import { defineStore } from 'pinia'
import {
  fetchRestaurantBySlug,
  getRestaurants,
  createRestaurant,
  updateRestaurantByID,
  deleteRestaurantByID,
} from 'src/services/restaurantService'
import { useAuthStore } from './authStore'

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    restaurant: null,
    restaurants: [],
  }),

  actions: {
    async fetchRestaurants(searchQuery = {}) {
      this.loading = true
      this.error = null
      const authStore = useAuthStore()
      const userID = authStore.user.id

      if (authStore.user.role === 'proprio') {
        searchQuery.createdBy = userID
      }

      try {
        const response = await getRestaurants(searchQuery) // Appel au service
        this.restaurants = response.data.restaurants // Met à jour la liste
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Erreur lors de la récupération des établissements.'
      } finally {
        this.loading = false
      }
    },

    async fetchRestaurant(id) {
      this.loading = true
      this.error = null

      try {
        const response = await fetchRestaurantBySlug(id)
        this.restaurant = response.data.restaurant
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement des détails.'

        throw this.error
      } finally {
        this.loading = false
      }
    },

    async addRestaurant(restaurantData) {
      try {
        await createRestaurant(useAuthStore().token, restaurantData)
        this.error = null // Réinitialiser les erreurs
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Échec de l’ajout du restaurant. Essayez à nouveau.'
        throw this.error
      }
    },

    async updateRestaurant(restaurantData) {
      try {
        await updateRestaurantByID(useAuthStore().token, restaurantData)
        this.error = null
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'Échec de la mise à jour des informations du restaurant. Essayez à nouveau.'
        throw this.error
      }
    },

    async deleteRestaurant(ID) {
      try {
        await deleteRestaurantByID(useAuthStore().token, ID)
        this.error = null
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Échec de la suppression du restaurant. Essayez à nouveau.'
        throw this.error
      }
    },
  },
})
