import { api } from 'boot/axios'

// Obtenir tous les parkings ou effectuer une recherche par nom
export const getParkings = async (searchQuery = {}) => {
  const params = searchQuery ? searchQuery : {}
  return await api.get('/establishments/parkings', { params })
}
export const fetchParkingBySlug = async (slug) => {
  return await api.get(`/establishments/parkings/${slug}`)
}

export const createParking = async (token, parkingData) => {
  return await api.post('/establishments/parkings/', parkingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const updateParkingByID = async (token, parkingData) => {
  return await api.patch('/establishments/parkings/' + parkingData._id, parkingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const deleteParkingByID = async (token, ID) => {
  return await api.delete('/establishments/parkings/' + ID, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
