import { api } from 'boot/axios'

// Obtenir toutes les activités ou effectuer une recherche par nom
export const getActivities = async (searchQuery = {}) => {
  const params = searchQuery ? searchQuery : {}
  return await api.get('/establishments/activities', { params })
}

export const fetchActivityBySlug = async (slug) => {
  return await api.get(`/establishments/activities/${slug}`)
}

export const createActivity = async (token, activityData) => {
  return await api.post('/establishments/activities/', activityData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const updateActivityByID = async (token, activityData) => {
  return await api.patch('/establishments/activities/' + activityData._id, activityData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const deleteActivityByID = async (token, ID) => {
  return await api.delete('/establishments/activities/' + ID, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
