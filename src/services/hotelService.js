import { api } from 'boot/axios'

// Obtenir tous les hotels ou effectuer une recherche par nom
export const getHotels = async (searchQuery = {}) => {
  const params = searchQuery ? searchQuery : {}
  return await api.get('/establishments/hotels', { params })
}
export const fetchHotelBySlug = async (slug) => {
  return await api.get(`/establishments/hotels/${slug}`)
}

export const createHotel = async (token, hotelData) => {
  return await api.post('/establishments/hotels/', hotelData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const updateHotelByID = async (token, hotelData) => {
  return await api.patch('/establishments/hotels/' + hotelData._id, hotelData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const deleteHotelByID = async (token, ID) => {
  return await api.delete('/establishments/hotels/' + ID, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
