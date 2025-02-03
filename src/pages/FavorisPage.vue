<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <q-header class="bg-white text-dark q-pa-sm">
      <q-toolbar>
        <div class="row">
          <div class="col-8 text-h6">Favoris</div>
          <div class="col-4"></div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Main content -->

    <!-- Gestion du chargement -->
    <div v-if="establishmentStore.loading" class="text-center q-my-lg">
      <q-spinner color="primary" />
      <p>Chargement liste favoris...</p>
    </div>

    <!-- Gestion des erreurs -->
    <div v-else-if="establishmentStore.error" class="text-center text-negative q-my-lg">
      <q-icon name="error" size="xl" />
      <p>{{ establishmentStore.error }}</p>
    </div>

    <!-- Liste des activités -->
    <div v-else-if="establishmentStore.favoris.length" class="list">
      <q-card
        v-for="(favoris, i) in establishmentStore.favoris"
        :key="i"
        class="my-card q-mb-md border no-box-shadow"
        @click="viewDetails(favoris)"
      >
        <!-- Image principale -->
        <q-btn
          class="icon"
          push
          round
          dense
          color="white"
          text-color="negative"
          icon="favorite"
          @click.stop="removeFavoris(favoris)"
        />
        <img :src="favoris.establishment.images[0]" alt="Image" class="activity-image" />

        <!-- Détails de l'activité -->
        <q-card-section>
          <div class="row justify-between">
            <div class="col-12">
              <div class="text-weight-bold">{{ favoris.establishment.name }}</div>
              <div class="text-caption text-secondary">
                {{ favoris.establishment.location.city }},
                {{ favoris.establishment.location.address }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useEstablishmentStore } from 'src/stores/establishmentStore'

import { useRouter } from 'vue-router'
const router = useRouter()

const establishmentStore = useEstablishmentStore() // Store Pinia

// Charger les activités à l'affichage de la page
onMounted(() => {
  establishmentStore.fetchFavoris()
})

// Afficher plus de détails sur une activité
const viewDetails = (favoris) => {
  // Rediriger ou afficher un modal avec plus d'informations

  if (favoris.establishment.type == 'Activité')
    router.push('/activity/' + favoris.establishment.slug)
  else if (favoris.establishment.type == 'Restaurant')
    router.push('/restaurant/' + favoris.establishment.slug)
  else if (favoris.establishment.type == 'Hotel')
    router.push('/hotel/' + favoris.establishment.slug)
  else if (favoris.establishment.type == 'Parking')
    router.push('/parking/' + favoris.establishment.slug)
}

const removeFavoris = (favoris) => {
  establishmentStore.removeFavoris(favoris.establishment._id).finally(() => {
    establishmentStore.fetchFavoris()
  })
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
  border-radius: 10px 10px 0 0;
}

.icon {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
