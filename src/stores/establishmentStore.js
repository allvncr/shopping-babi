import { defineStore } from 'pinia'
import {
  getEstablishments,
  getActivities,
  fetchActivityBySlug,
  fetchRestaurantBySlug,
  fetchHotelBySlug,
  fetchParkingBySlug,
  getFavoris,
  deleteFavoris,
  addFavoris,
  getParkings,
} from 'src/services/establishmentService'
import { useAuthStore } from './authStore'

export const useEstablishmentStore = defineStore('establishment', {
  state: () => ({
    favoris: [], // Liste des favoris
    establishments: [], // Liste des établissements
    loading: false, // Indicateur de chargement
    error: null, // Message d'erreur éventuel
    activity: null,
    restaurant: null,
    hotel: null,
    parking: null,
    parkings: [],
  }),

  actions: {
    async fetchEstablishments(searchQuery = '') {
      this.loading = true
      this.error = null

      try {
        const response = await getEstablishments(searchQuery) // Appel au service
        this.establishments = response.data.establishments // Met à jour la liste
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Erreur lors de la récupération des établissements.'
      } finally {
        this.loading = false
      }
    },

    async fetchActivities(searchQuery = '') {
      this.loading = true
      this.error = null

      try {
        const response = await getActivities(searchQuery) // Appel au service
        this.establishments = response.data.activities // Met à jour la liste
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

    async fetchFavoris() {
      this.loading = true
      this.error = null

      try {
        const response = await getFavoris(useAuthStore().token)
        this.favoris = response.data.favorites // Met à jour la liste
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Erreur lors de la récupération des établissements.'
      } finally {
        this.loading = false
      }
    },

    async createFavoris(favoris) {
      this.loading = true
      this.error = null

      try {
        await addFavoris(useAuthStore().token, favoris) // Appel au service
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Erreur lors de la récupération des établissements.'
      } finally {
        this.loading = false
      }
    },

    async removeFavoris(favoris) {
      this.loading = true
      this.error = null

      try {
        await deleteFavoris(useAuthStore().token, favoris) // Appel au service
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Erreur lors de la récupération des établissements.'
      } finally {
        this.loading = false
      }
    },

    async fetchParkings(searchQuery = '') {
      this.loading = true
      this.error = null

      try {
        const response = await getParkings(searchQuery) // Appel au service
        this.parkings = response.data.activities // Met à jour la liste
      } catch (err) {
        this.error =
          err.response?.data?.message || 'Erreur lors de la récupération des établissements.'
      } finally {
        this.loading = false
      }
    },
  },
})
