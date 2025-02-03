<template>
  <q-page class="q-mb-md">
    <!-- Loading & Error -->
    <div v-if="establishmentStore.loading" class="text-center q-my-lg">
      <q-spinner color="primary" />
      <p>Chargement des détails...</p>
    </div>

    <div v-else-if="establishmentStore.error" class="text-center text-negative q-my-lg">
      <q-icon name="error" size="xl" />
      <p>{{ establishmentStore.error }}</p>
    </div>

    <!-- Détails du restaurant -->
    <div>
      <!-- Image principale -->
      <q-btn flat round dense icon="arrow_back" @click="goBack" class="back" />
      <q-carousel
        v-if="restaurant"
        animated
        swipeable
        navigation
        infinite
        v-model="slide"
        v-model:fullscreen="fullscreen"
      >
        <q-carousel-slide
          v-for="(img, index) in restaurant.images"
          :key="index"
          :name="index"
          :img-src="img"
        />
        <template v-slot:control>
          <q-carousel-control position="top-right" :offset="[18, 18]">
            <q-btn
              v-if="favorite"
              push
              round
              dense
              color="white"
              text-color="negative"
              icon="favorite"
              @click="removeFavoris"
            />
            <q-btn
              v-else
              push
              round
              dense
              color="white"
              text-color="grey-7"
              icon="favorite"
              @click="createFavoris"
            />
          </q-carousel-control>
          <q-carousel-control position="bottom-right" :offset="[18, 18]">
            <q-btn
              push
              round
              dense
              color="white"
              text-color="primary"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreen = !fullscreen"
            />
          </q-carousel-control>
        </template>
      </q-carousel>

      <!-- Informations principales -->
      <q-card-section v-if="restaurant">
        <div class="text-h6 text-weight-bold">{{ restaurant.name }}</div>
        <p class="text-secondary">{{ restaurant.description }}</p>
        <div class="text-weight-bold">Localisation</div>
        <div class="text-caption text-primary">
          {{ restaurant.location.city }}, {{ restaurant.location.address }}
        </div>
      </q-card-section>

      <div class="q-px-md">
        <div ref="mapContainer" style="height: 270px"></div>
      </div>

      <q-separator />

      <!-- Horaires -->
      <q-card-section v-if="restaurant">
        <div class="text-weight-bold">Horaires</div>
        <div class="text-caption">
          {{ restaurant.openingHours.start }} - {{ restaurant.openingHours.end }}
        </div>
      </q-card-section>

      <q-separator />

      <!-- Type de cuisine -->
      <q-card-section v-if="restaurant">
        <div class="text-weight-bold">Type de cuisine</div>
        <div class="text-caption">{{ restaurant.cuisineType }}</div>
      </q-card-section>

      <q-separator />

      <!-- Équipements et Services -->
      <q-card-section v-if="restaurant">
        <div class="text-weight-bold">Équipements et Services</div>
        <q-chip
          v-for="(amenity, index) in restaurant.amenities"
          :key="index"
          outline
          class="q-mt-sm"
        >
          {{ amenity }}
        </q-chip>
      </q-card-section>

      <q-separator />

      <!-- Notes -->
      <q-card-section v-if="restaurant">
        <div class="text-weight-bold">Avis</div>
        <div class="text-caption">
          Note moyenne : {{ restaurant.ratings.average }}/5 ({{ restaurant.ratings.count }} avis)
        </div>
      </q-card-section>

      <q-separator />

      <!-- Contact -->
      <q-card-section v-if="restaurant">
        <div class="text-weight-bold">Contact</div>
        <div class="q-mt-sm">
          <q-item v-if="restaurant.contact.phone">
            <q-item-section>
              <q-icon name="phone" />
            </q-item-section>
            <q-item-section>{{ restaurant.contact.phone }}</q-item-section>
          </q-item>
          <q-item v-if="restaurant.contact.email">
            <q-item-section>
              <q-icon name="email" />
            </q-item-section>
            <q-item-section>{{ restaurant.contact.email }}</q-item-section>
          </q-item>
          <q-item v-if="restaurant.contact.website">
            <q-item-section>
              <q-icon name="language" />
            </q-item-section>
            <q-item-section>
              <a :href="restaurant.contact.website" target="_blank">{{
                restaurant.contact.website
              }}</a>
            </q-item-section>
          </q-item>
        </div>
        <q-btn label="Réserver" color="primary" unelevated class="full-width" @click="onReserve" />
      </q-card-section>
    </div>
    <q-dialog v-model="showReservationPopup" full-width persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Réserver une table</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit="submitReservation">
            <!-- Date -->
            <q-input v-model="reservation.date" type="date" label="Date" outlined required />

            <!-- Heure -->
            <q-input
              v-model="reservation.time"
              type="time"
              label="Heure"
              outlined
              required
              class="q-mt-md"
            />

            <!-- Nombre de personnes -->
            <q-input
              v-model="reservation.people"
              type="number"
              label="Nombre de personnes"
              outlined
              required
              class="q-mt-md"
            />

            <!-- Informations supplémentaires -->
            <q-input
              v-model="reservation.additionalInfo"
              type="textarea"
              label="Informations supplémentaires"
              outlined
              class="q-mt-md"
            />

            <div class="q-mt-md">
              <q-btn
                type="submit"
                label="Confirmer"
                color="primary"
                unelevated
                class="full-width"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="secondary" @click="showReservationPopup = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEstablishmentStore } from 'src/stores/establishmentStore'
import { useAuthStore } from 'src/stores/authStore'
import L from 'leaflet'

const establishmentStore = useEstablishmentStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const slide = ref(0)
const restaurant = ref(null)
const fullscreen = ref(false)
const mapContainer = ref(null)
const map = ref()

// Popup pour réservation
const showReservationPopup = ref(false)

// Formulaire de réservation
const reservation = ref({
  date: '',
  time: '',
  people: '',
  additionalInfo: '',
})

const goBack = () => {
  router.back()
}

const onReserve = () => {
  console.log('Réserver une table')
  showReservationPopup.value = true
}

const submitReservation = () => {
  console.log('Données de réservation :', reservation.value)
  showReservationPopup.value = false
  // Logique d'envoi au backend ici
}

const createFavoris = () => {
  establishmentStore.createFavoris(restaurant.value._id).finally(() => {
    establishmentStore.fetchFavoris()
  })
}

const removeFavoris = () => {
  establishmentStore.removeFavoris(restaurant.value._id).finally(() => {
    establishmentStore.fetchFavoris()
  })
}

const favorite = computed(() => {
  return establishmentStore.favoris.some((fav) => fav.establishment._id === restaurant.value?._id)
})

onMounted(() => {
  establishmentStore
    .fetchRestaurant(route.params.slug)
    .then(() => {
      restaurant.value = establishmentStore.restaurant
      if (authStore.user && authStore.token) establishmentStore.fetchFavoris()

      map.value = L.map(mapContainer.value).setView(
        [
          restaurant.value.location.coordinates.latitude,
          restaurant.value.location.coordinates.longitude,
        ],
        13,
      )
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value)
      L.marker([
        restaurant.value.location.coordinates.latitude,
        restaurant.value.location.coordinates.longitude,
      ])
        .addTo(map.value)
        .bindPopup(`<b>${restaurant.value.name}</b><br>${restaurant.value.location.address}`)
        .openPopup()
    })
    .catch(() => {
      router.push('/404')
    })
})
</script>

<style lang="scss">
/* Styles personnalisés */
.back {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
  background: #fff;
}
.full-width {
  width: 100%;
}
.q-carousel {
  height: 300px;
}
</style>
