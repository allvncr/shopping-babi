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

    <!-- Détails de l'hôtel -->
    <div>
      <!-- Image principale -->
      <q-btn flat round dense icon="arrow_back" @click="goBack" class="back" />
      <q-carousel
        v-if="hotel"
        animated
        swipeable
        navigation
        infinite
        v-model="slide"
        v-model:fullscreen="fullscreen"
      >
        <q-carousel-slide
          v-for="(img, index) in hotel.images"
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
      <q-card-section v-if="hotel">
        <div class="text-h6 text-weight-bold">{{ hotel.name }}</div>
        <p class="text-secondary">{{ hotel.description }}</p>
        <div class="text-weight-bold">Localisation</div>
        <div class="text-caption text-primary">
          {{ hotel.location.city }}, {{ hotel.location.address }}
        </div>
      </q-card-section>

      <div class="q-px-md">
        <div ref="mapContainer" style="height: 270px"></div>
      </div>

      <q-separator />

      <!-- Horaires -->
      <q-card-section v-if="hotel">
        <div class="text-weight-bold">Horaires</div>
        <div class="text-caption">
          {{ hotel.openingHours.start }} - {{ hotel.openingHours.end }}
        </div>
      </q-card-section>

      <q-separator />

      <!-- Types de chambres -->
      <q-card-section v-if="hotel">
        <div class="text-weight-bold">Types de chambres</div>
        <div class="text-caption">
          <ul>
            <li v-for="(room, index) in hotel.roomTypes" :key="index">{{ room }}</li>
          </ul>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Prix -->
      <q-card-section v-if="hotel">
        <div class="text-weight-bold">Prix par nuit</div>
        <div class="text-caption">{{ hotel.pricePerNight }} CFA</div>
      </q-card-section>

      <q-separator />

      <!-- Équipements et Services -->
      <q-card-section v-if="hotel">
        <div class="text-weight-bold">Équipements et Services</div>
        <q-chip v-for="(amenity, index) in hotel.amenities" :key="index" outline class="q-mt-sm">
          {{ amenity }}
        </q-chip>
      </q-card-section>

      <q-separator />

      <!-- Contact -->
      <q-card-section v-if="hotel">
        <div class="text-weight-bold">Contact</div>
        <div class="q-mt-sm">
          <q-item v-if="hotel.contact.phone">
            <q-item-section>
              <q-icon name="phone" />
            </q-item-section>
            <q-item-section>{{ hotel.contact.phone }}</q-item-section>
          </q-item>
          <q-item v-if="hotel.contact.email">
            <q-item-section>
              <q-icon name="email" />
            </q-item-section>
            <q-item-section>{{ hotel.contact.email }}</q-item-section>
          </q-item>
          <q-item v-if="hotel.contact.website">
            <q-item-section>
              <q-icon name="language" />
            </q-item-section>
            <q-item-section>
              <a :href="hotel.contact.website" target="_blank">{{ hotel.contact.website }}</a>
            </q-item-section>
          </q-item>
        </div>
        <q-btn label="Réserver" color="primary" unelevated class="full-width" @click="onReserve" />
      </q-card-section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEstablishmentStore } from 'src/stores/establishmentStore'
import { useAuthStore } from 'src/stores/authStore'
import L from 'leaflet'

const establishmentStore = useEstablishmentStore() // Store Pinia
const authStore = useAuthStore() // Store Pinia

const route = useRoute()
const router = useRouter()

const slide = ref(0)
const hotel = ref(null)
const fullscreen = ref(false)
const mapContainer = ref(null)
const map = ref()

// Retour à la page précédente
const goBack = () => {
  router.back()
}

const onReserve = () => {
  //   router.push(`/reservation/${hotel.value._id}`)
}

const createFavoris = () => {
  establishmentStore.createFavoris(hotel.value._id).finally(() => {
    establishmentStore.fetchFavoris()
  })
}

const removeFavoris = () => {
  establishmentStore.removeFavoris(hotel.value._id).finally(() => {
    establishmentStore.fetchFavoris()
  })
}

// Propriété calculée pour savoir si l'hôtel est un favori
const favorite = computed(() => {
  var bool = establishmentStore.favoris.filter((fav) => fav.establishment._id === hotel.value?._id)
  return bool.length
})

// Charger les détails de l'hôtel à l'affichage de la page
onMounted(() => {
  establishmentStore
    .fetchHotel(route.params.slug)
    .then(() => {
      hotel.value = establishmentStore.hotel
      if (authStore.user && authStore.token) establishmentStore.fetchFavoris()

      map.value = L.map(mapContainer.value).setView(
        [hotel.value.location.coordinates.latitude, hotel.value.location.coordinates.longitude],
        13,
      )
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value)
      L.marker([
        hotel.value.location.coordinates.latitude,
        hotel.value.location.coordinates.longitude,
      ])
        .addTo(map.value)
        .bindPopup(`<b>${hotel.value.name}</b><br>${hotel.value.location.address}`)
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
