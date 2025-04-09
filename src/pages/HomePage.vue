<template>
  <q-page class="bg-grey-2">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Bienvenue, {{ authStore.user.firstname }} !</q-toolbar-title>
      <q-btn flat @click="logout" label="Déconnexion" class="text-white" />
    </q-toolbar>

    <q-card-section class="q-pa-md">
      <q-grid cols="2" gutter="16px">
        <q-col v-for="card in filteredCards" :key="card.label">
          <q-card class="hover-card q-mb-md" bordered @click="navigateTo(card.route)">
            <q-card-section class="text-center">
              <img :src="card.image" width="104px" alt="" />
              <div class="text-h6 q-mt-sm">{{ card.label }}</div>
            </q-card-section>
          </q-card>
        </q-col>
      </q-grid>
    </q-card-section>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/stores/authStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const cards = [
  {
    label: 'Gestion Utilisateurs',
    image: 'src/assets/images/welcome.png',
    route: '/admin/users',
    role: 'superAdmin', // Uniquement pour superAdmin
  },
  {
    label: 'Gestion Hotels',
    image: 'src/assets/images/Hotel.png',
    route: '/admin/hotels',
    type: 'Hotel',
  },
  {
    label: 'Gestion Restaurants',
    image: 'src/assets/images/Resto.png',
    route: '/admin/restaurants',
    type: 'Restaurant',
  },
  {
    label: 'Gestion Activités',
    image: 'src/assets/images/Activite.png',
    route: '/admin/activities',
    type: 'Activité',
  },
  {
    label: 'Gestion Parkings',
    image: 'src/assets/images/Auto.png',
    route: '/admin/parkings',
    type: 'Parking',
  },
  {
    label: 'Gestion Réservations',
    image: 'src/assets/images/membership.png',
    route: '/admin/reservations',
  },
]

// Filtrer les cartes selon le rôle et les types d'établissements
const filteredCards = computed(() => {
  if (authStore.user.role === 'superAdmin') {
    // Le superAdmin voit tout
    return cards
  }

  if (authStore.user.role === 'proprio') {
    // Le proprio ne voit que les cartes sans rôle et celles qu'il peut modifier
    return cards.filter((card) => {
      return !card.role && (!card.type || authStore.user.establishmentTypes?.includes(card.type))
    })
  }

  // Les autres rôles ne voient rien pour le moment
  return []
})

// Navigation
function navigateTo(route) {
  if (route) router.push(route)
}

// Déconnexion
function logout() {
  authStore.logout()
}
</script>

<style scoped>
.q-toolbar {
  padding: 0 1rem;
}

.q-toolbar__title {
  font-size: 14px;
}
.q-grid {
  display: grid;
  gap: 1rem;
}
.hover-card {
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 12px;
  padding: 1rem;
}
.hover-card:hover {
  background-color: var(--q-color-primary-light);
}
</style>
