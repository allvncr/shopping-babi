import { api } from 'boot/axios'

export const addToCart = async (token, payload) => {
  return await api.post('/cart', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const removeFromCart = async (token, ID) => {
  return await api.delete('/cart/' + ID, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getCart = async (token) => {
  return await api.get('/cart', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const createReservation = async (token) => {
  return await api.post('/reservations', null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getReservationsByUser = async (token) => {
  return await api.get('/reservations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const cancelReservation = async (token, reservationID) => {
  return await api.put(`/reservations/${reservationID}/cancel`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
