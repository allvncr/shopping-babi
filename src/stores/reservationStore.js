import { defineStore } from 'pinia'
import {
  addToCart,
  getCart,
  removeFromCart,
  createReservation,
  getReservationsByUser,
  cancelReservation,
} from 'src/services/reservationService'
import { useAuthStore } from './authStore'

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    panier: localStorage.getItem('panier') ? JSON.parse(localStorage.getItem('panier')) : null,
    error: null,
    reservations: [],
  }),

  actions: {
    async activityReservation(info) {
      try {
        await addToCart(useAuthStore().token, info)
      } catch (err) {
        this.error = err.response?.data?.message || 'Échec de la reservation. Essayez à nouveau.'
        throw this.error
      }
    },

    async removePanier(ID) {
      await removeFromCart(useAuthStore().token, ID)
    },

    async getPanier() {
      try {
        const response = await getCart(useAuthStore().token)

        this.panier = response.data.cart
        localStorage.setItem('panier', JSON.stringify(this.panier))
        this.error = null
      } catch (err) {
        this.panier = null
        this.error =
          err.response?.data?.message || 'Échec de la recuperation du panier. Essayez à nouveau.'
      }
    },

    async checkout() {
      try {
        await createReservation(useAuthStore().token)
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'Échec de la creation de la reservation. Essayez à nouveau.'
      }
    },

    async getReservations() {
      try {
        const response = await getReservationsByUser(useAuthStore().token)

        this.reservations = response.data.reservations
        this.error = null
      } catch (err) {
        this.reservations = []
        this.error =
          err.response?.data?.message ||
          'Échec de la recuperation des reservations. Essayez à nouveau.'
      }
    },

    async cancelReservation(reservationID) {
      try {
        await cancelReservation(useAuthStore().token, reservationID)
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          "Échec de l'annulation de la reservation. Essayez à nouveau."
      }
    },
  },
})
