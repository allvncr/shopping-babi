import { api } from 'boot/axios'

export const getEstablishments = async (searchQuery = '') => {
  const params = searchQuery ? { name: searchQuery } : {}
  return await api.get('/establishments', { params })
}

export const fetchRestaurantBySlug = async (slug) => {
  return await api.get(`/establishments/restaurants/${slug}`)
}

export const fetchHotelBySlug = async (slug) => {
  return await api.get(`/establishments/hotels/${slug}`)
}

export const getFavoris = async (token) => {
  return await api.get('/favorites', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const addFavoris = async (token, favoris) => {
  return await api.post(
    '/favorites',
    {
      establishmentId: favoris,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

export const deleteFavoris = async (token, favoris) => {
  return await api.delete(`/favorites/${favoris}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
