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

    <!-- Détails du parking -->
    <div class="q-mb-xl">
      <!-- Image principale -->
      <q-btn flat round dense icon="arrow_back" @click="goBack" class="back" />
      <q-carousel
        v-if="parking"
        animated
        swipeable
        navigation
        infinite
        v-model="slide"
        v-model:fullscreen="fullscreen"
      >
        <q-carousel-slide
          v-for="(img, index) in parking.images"
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
      <q-card-section v-if="parking">
        <div class="text-h6 text-weight-bold">{{ parking.name }}</div>
        <p class="text-secondary">{{ parking.description }}</p>
        <div class="text-weight-bold">Localisation</div>
        <div class="text-caption text-primary">
          {{ parking.location.city }}, {{ parking.location.address }}
        </div>
      </q-card-section>

      <div class="q-px-md">
        <div ref="mapContainer" style="height: 270px"></div>
      </div>

      <q-separator />

      <!-- Horaires -->
      <q-card-section v-if="parking">
        <div class="text-weight-bold">Horaires</div>
        <div class="text-caption">
          {{ parking.openingHours.start }} - {{ parking.openingHours.end }}
        </div>
      </q-card-section>

      <q-separator />

      <!-- Tarif par heure -->
      <q-card-section v-if="parking">
        <div class="text-weight-bold">Tarif par heure</div>
        <div class="text-caption">{{ parking.pricePerHour }} CFA</div>
      </q-card-section>

      <q-separator />

      <!-- Contact -->
      <q-card-section v-if="parking">
        <div class="text-weight-bold">Contact</div>
        <div class="q-mt-sm">
          <q-item v-if="parking.contact.phone">
            <q-item-section>
              <q-icon name="phone" />
            </q-item-section>
            <q-item-section>{{ parking.contact.phone }}</q-item-section>
          </q-item>
          <q-item v-if="parking.contact.email">
            <q-item-section>
              <q-icon name="email" />
            </q-item-section>
            <q-item-section>{{ parking.contact.email }}</q-item-section>
          </q-item>
          <q-item v-if="parking.contact.website">
            <q-item-section>
              <q-icon name="language" />
            </q-item-section>
            <q-item-section>
              <a :href="parking.contact.website" target="_blank">{{ parking.contact.website }}</a>
            </q-item-section>
          </q-item>
        </div>
        <q-btn
          label="Réserver une place"
          color="primary"
          unelevated
          class="full-width"
          @click="showReservationPopup = true"
        />
      </q-card-section>
    </div>

    <!-- Boîte de dialogue pour réservation -->
    <q-dialog full-width v-model="showReservationPopup">
      <q-card>
        <q-card-section>
          <div class="text-h6">Réserver une place</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit="submitReservation">
            <q-input
              v-model="reservation.startDate"
              type="date"
              mask="####-##-##"
              label="Date de début"
              outlined
              required
              class="q-mt-md"
            />
            <q-input
              v-model="reservation.startTime"
              type="time"
              mask="##:##"
              label="Heure de début"
              outlined
              required
              class="q-mt-md"
            />

            <q-input
              v-model="reservation.endDate"
              type="date"
              mask="####-##-##"
              label="Date de fin"
              outlined
              required
              class="q-mt-md"
            />
            <q-input
              v-model="reservation.endTime"
              type="time"
              mask="##:##"
              label="Heure de fin"
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
import { useReservationStore } from 'src/stores/reservationStore'
import L from 'leaflet'
import { useQuasar } from 'quasar'
const $q = useQuasar()

const establishmentStore = useEstablishmentStore() // Store Pinia
const authStore = useAuthStore() // Store Pinia
const reservationStore = useReservationStore() // Store Pinia

const route = useRoute()
const router = useRouter()

const slide = ref(0)
const parking = ref(null)
const fullscreen = ref(false)
const showReservationPopup = ref(false)
const mapContainer = ref(null)
const map = ref()

const reservation = ref({
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  additionalInfo: '',
})

// Retour à la page précédente
const goBack = () => {
  router.back()
}

const calculateTotalHours = () => {
  const start = new Date(`${reservation.value.startDate}T${reservation.value.startTime}`)
  const end = new Date(`${reservation.value.endDate}T${reservation.value.endTime}`)

  // Calcul de la différence en millisecondes
  const diffMs = end - start

  // Conversion en heures
  const totalHours = Math.max(diffMs / (1000 * 60 * 60), 0)
  return Math.ceil(totalHours)
}

const submitReservation = () => {
  // Logique d'envoi au backend ici
  reservationStore
    .activityReservation({
      establishmentId: parking.value._id,
      establishmentType: parking.value.type,
      reservationStartDate: reservation.value.startDate,
      reservationStartTime: reservation.value.startTime,
      reservationEndDate: reservation.value.endDate,
      reservationEndTime: reservation.value.endTime,
      additionalInfo: reservation.value.additionalInfo,
      price: calculateTotalHours() * +parking.value.pricePerHour,
      ...reservation.value,
    })
    .then(() => {
      showReservationPopup.value = false
      $q.dialog({
        title: 'Réservation',
        message: 'Réservation réussie!',
      }).onOk(() => {
        router.push('/panier')
      })
    })
    .catch((error) => {
      $q.dialog({
        title: 'Réservation',
        message: `Erreur lors de la réservation: ${error}`,
      })
    })
}

const createFavoris = () => {
  establishmentStore.createFavoris(parking.value._id).finally(() => {
    establishmentStore.fetchFavoris()
  })
}

const removeFavoris = () => {
  establishmentStore.removeFavoris(parking.value._id).finally(() => {
    establishmentStore.fetchFavoris()
  })
}

// Propriété calculée pour savoir si le parking est un favori
const favorite = computed(() => {
  var bool = establishmentStore.favoris.filter(
    (fav) => fav.establishment._id === parking.value?._id,
  )
  return bool.length
})

// Charger les parkings à l'affichage de la page
onMounted(() => {
  establishmentStore
    .fetchParking(route.params.slug)
    .then(() => {
      parking.value = establishmentStore.parking
      if (authStore.user && authStore.token) establishmentStore.fetchFavoris()

      map.value = L.map(mapContainer.value).setView(
        [parking.value.location.coordinates.latitude, parking.value.location.coordinates.longitude],
        13,
      )
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value)
      L.marker([
        parking.value.location.coordinates.latitude,
        parking.value.location.coordinates.longitude,
      ])
        .addTo(map.value)
        .bindPopup(`<b>${parking.value.name}</b><br>${parking.value.location.address}`)
        .openPopup()
    })
    .catch(() => {
      // router.push('/404')
    })
})
</script>

<style lang="scss">
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
</style>
