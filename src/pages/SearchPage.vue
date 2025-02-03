<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <q-header class="bg-white text-dark q-pa-sm">
      <q-toolbar>
        <div class="row">
          <div class="col-8 text-h6">Explorez les meilleurs endroits de la ville</div>
          <div class="col-4"></div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Formulaire de recherche -->
    <q-form @submit.prevent="handleSearch" class="q-gutter-md">
      <q-input
        outlined
        bottom-slots
        v-model="search"
        label="Rechercher un endroit"
        dense
        @input="handleSearch"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click="clearSearch" class="cursor-pointer" />
        </template>
      </q-input>
    </q-form>

    <!-- Tabs pour les entités -->
    <q-tabs v-model="activeTab" class="text-primary q-my-md" align="justify" active-color="primary">
      <q-tab
        name="hotels"
        label="Hôtels"
        icon="hotel"
        class="text-primary"
        indicator-color="primary"
      />
      <q-tab
        name="restaurants"
        label="Restaurants"
        icon="restaurant"
        class="text-positive"
        indicator-color="positive"
      />
      <q-tab
        name="parkings"
        label="Parkings"
        icon="local_parking"
        class="text-negative"
        indicator-color="negative"
      />
      <q-tab
        name="activities"
        label="Activités"
        icon="directions_run"
        class="text-secondary"
        indicator-color="secondary"
      />
    </q-tabs>

    <q-separator />

    <!-- Contenu des onglets -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- Onglet Hôtels -->
      <q-tab-panel name="hotels">
        <img src="../assets/images/Hotel.png" alt="" class="logoEta" />
        <div v-if="filteredHotels.length === 0" class="text-center q-my-lg">
          <q-icon name="info" size="xl" class="text-primary" />
          <p>Aucun hôtel trouvé.</p>
        </div>
        <q-card
          v-for="(hotel, i) in filteredHotels"
          :key="i"
          class="my-card q-mb-md border no-box-shadow"
          @click="viewDetails(hotel)"
        >
          <img :src="hotel.images[0]" alt="Image" class="activity-image" />
          <q-card-section>
            <div class="text-weight-bold">{{ hotel.name }}</div>
            <div class="text-caption text-primary">
              {{ hotel.location.city }}, {{ hotel.location.address }}
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Onglet Restaurants -->
      <q-tab-panel name="restaurants">
        <img src="../assets/images/Resto.png" alt="" class="logoEta" />
        <div v-if="filteredRestaurants.length === 0" class="text-center q-my-lg">
          <q-icon name="info" size="xl" class="text-positive" />
          <p>Aucun restaurant trouvé.</p>
        </div>
        <q-card
          v-for="(restaurant, i) in filteredRestaurants"
          :key="i"
          class="my-card q-mb-md border no-box-shadow"
          @click="viewDetails(restaurant)"
        >
          <img :src="restaurant.images[0]" alt="Image" class="activity-image" />
          <q-card-section>
            <div class="text-weight-bold">{{ restaurant.name }}</div>
            <div class="text-caption text-secondary">
              {{ restaurant.location.city }}, {{ restaurant.location.address }}
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Onglet Parkings -->
      <q-tab-panel name="parkings">
        <img src="../assets/images/Auto.png" alt="" class="logoEta" />
        <div v-if="filteredParkings.length === 0" class="text-center q-my-lg">
          <q-icon name="info" size="xl" class="text-primary" />
          <p>Aucun parking trouvé.</p>
        </div>
        <q-card
          v-for="(parking, i) in filteredParkings"
          :key="i"
          class="my-card q-mb-md border no-box-shadow"
          @click="viewDetails(parking)"
        >
          <img :src="parking.images[0]" alt="Image" class="activity-image" />
          <q-card-section>
            <div class="text-weight-bold">{{ parking.name }}</div>
            <div class="text-caption text-negative">
              {{ parking.location.city }}, {{ parking.location.address }}
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Onglet Activités -->
      <q-tab-panel name="activities">
        <img src="../assets/images/Activite.png" alt="" class="logoEta" />
        <div v-if="filteredActivities.length === 0" class="text-center q-my-lg">
          <q-icon name="info" size="xl" class="text-primary" />
          <p>Aucune activité trouvée.</p>
        </div>
        <q-card
          v-for="(activity, i) in filteredActivities"
          :key="i"
          class="my-card q-mb-md border no-box-shadow"
          @click="viewDetails(activity)"
        >
          <img :src="activity.images[0]" alt="Image" class="activity-image" />
          <q-card-section>
            <div class="text-weight-bold">{{ activity.name }}</div>
            <div class="text-caption text-secondary">
              {{ activity.location.city }}, {{ activity.location.address }}
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEstablishmentStore } from 'src/stores/establishmentStore'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const search = ref('')
const activeTab = ref('hotels') // Onglet actif
const establishmentStore = useEstablishmentStore()

// Charger les données
onMounted(() => {
  establishmentStore.fetchEstablishments()
  if (route.query && route.query.type) {
    if (route.query.type == 'restaurants') activeTab.value = 'restaurants'
    else if (route.query.type == 'parkings') activeTab.value = 'parkings'
    else if (route.query.type == 'activities') activeTab.value = 'activities'
    else activeTab.value = 'hotels'
  }
})

// Filtres par type
const filteredHotels = computed(() =>
  establishmentStore.establishments.filter((e) => e.type === 'hotel'),
)
const filteredRestaurants = computed(() =>
  establishmentStore.establishments.filter((e) => e.type === 'restaurant'),
)
const filteredParkings = computed(() =>
  establishmentStore.establishments.filter((e) => e.type === 'parking'),
)
const filteredActivities = computed(() =>
  establishmentStore.establishments.filter((e) => e.type === 'activity'),
)

// Rechercher
const handleSearch = () => {
  establishmentStore.fetchEstablishments(search.value)
}
const clearSearch = () => {
  search.value = ''
  establishmentStore.fetchEstablishments()
}

// Voir les détails
const viewDetails = (establishment) => {
  router.push(`/${establishment.type}/${establishment.slug}`)
}
</script>

<style lang="scss">
.activity-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
}

.my-card {
  overflow: hidden;
}

.border {
  border-radius: 10px;
}

.logoEta {
  display: block;
  width: 144px;
  margin-bottom: 16px;
}
</style>
