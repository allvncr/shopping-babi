import { api } from 'boot/axios'

// Obtenir tous les restaurants ou effectuer une recherche par nom
export const getRestaurants = async (searchQuery = {}) => {
  const params = searchQuery ? searchQuery : {}
  return await api.get('/establishments/restaurants', { params })
}
export const fetchRestaurantBySlug = async (slug) => {
  return await api.get(`/establishments/restaurants/${slug}`)
}

export const createRestaurant = async (token, restaurantData) => {
  return await api.post('/establishments/restaurants/', restaurantData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const updateRestaurantByID = async (token, restaurantData) => {
  return await api.patch('/establishments/restaurants/' + restaurantData._id, restaurantData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const deleteRestaurantByID = async (token, ID) => {
  return await api.delete('/establishments/restaurants/' + ID, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
