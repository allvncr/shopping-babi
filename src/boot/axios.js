import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/authStore'

// Créer une instance Axios
// const api = axios.create({ baseURL: 'https://shoppingback-uqv1.onrender.com/api' })
const api = axios.create({ baseURL: 'http://localhost:3000/api' })

export default defineBoot(({ app }) => {
  const authStore = useAuthStore()

  // Ajouter un intercepteur pour les réponses
  api.interceptors.response.use(
    (response) => {
      // Retourner la réponse si elle est réussie
      return response
    },
    (error) => {
      // Vérifier si l'erreur est liée à un token expiré ou invalide
      if (
        error.response &&
        error.response.data &&
        (error.response.data.error === 'jwt expired' ||
          error.response.data.error === 'jwt malformed' ||
          error.response.data.message === 'Token invalide ou expiré')
      ) {
        // Déconnecter l'utilisateur
        authStore.logout()

        // Rediriger vers la page de connexion
        window.location.href = '/login'
      }

      // Propager l'erreur pour la gestion locale (si nécessaire)
      return Promise.reject(error)
    },
  )

  // Rendre les instances disponibles globalement dans les fichiers Vue
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
