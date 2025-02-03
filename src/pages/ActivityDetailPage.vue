<template>
  <q-page>
    <!-- Loading & Error -->
    <div v-if="establishmentStore.loading" class="text-center q-my-lg">
      <q-spinner color="primary" />
      <p>Chargement des détails...</p>
    </div>

    <div v-else-if="establishmentStore.error" class="text-center text-negative q-my-lg">
      <q-icon name="error" size="xl" />
      <p>{{ establishmentStore.error }}</p>
    </div>

    <!-- Détails de l'activité -->
    <div class="q-mb-xl">
      <!-- Image principale -->
      <q-btn flat round dense icon="arrow_back" @click="goBack" class="back" />
      <q-carousel
        v-if="activity"
        animated
        swipeable
        navigation
        infinite
        v-model="slide"
        v-model:fullscreen="fullscreen"
      >
        <q-carousel-slide
          v-for="(img, index) in activity.images"
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
      <q-card-section v-if="activity">
        <div class="text-h6 text-weight-bold">{{ activity.name }}</div>
        <p class="text-secondary">{{ activity.description }}</p>
        <div class="text-weight-bold">Localisation</div>
        <div class="text-caption text-primary">
          {{ activity.location.city }}, {{ activity.location.address }}
        </div>
      </q-card-section>
      <div class="q-px-md">
        <div ref="mapContainer" style="height: 270px"></div>
      </div>

      <q-separator />

      <!-- Horaires et Durée -->
      <q-card-section v-if="activity">
        <div class="text-weight-bold">Horaires</div>
        <div class="text-caption">
          {{ activity.openingHours.start }} - {{ activity.openingHours.end }}
        </div>
        <div class="text-weight-bold q-mt-md">Durée</div>
        <div class="text-caption">{{ activity.duration }}</div>
      </q-card-section>

      <q-separator />

      <!-- Prix -->
      <q-card-section v-if="activity">
        <div class="text-weight-bold">Prix</div>
        <div class="text-caption">{{ activity.price }} CFA</div>
        <div v-if="activity.priceDetails" class="q-mt-md">
          <div class="text-caption">Prix Enfant : {{ activity.priceDetails.childPrice }} CFA</div>
          <div class="text-caption">
            Réduction Groupe : {{ activity.priceDetails.groupDiscount }}%
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Services et Conforts -->
      <q-card-section v-if="activity">
        <div class="text-weight-bold">Équipements et Services</div>
        <q-chip v-for="(amenity, index) in activity.amenities" :key="index" outline class="q-mt-sm">
          {{ amenity }}
        </q-chip>
      </q-card-section>

      <q-separator />

      <!-- Public cible -->
      <q-card-section v-if="activity">
        <div class="text-weight-bold">Convient pour</div>
        <q-chip
          v-for="(target, index) in activity.suitableFor"
          :key="index"
          outline
          class="q-mt-sm"
        >
          {{ target }}
        </q-chip>
      </q-card-section>

      <q-separator />

      <!-- Notes -->
      <q-card-section v-if="activity">
        <div class="text-weight-bold">Avis</div>
        <div class="text-caption">
          Note moyenne : {{ activity.ratings.average }}/5 ({{ activity.ratings.count }} avis)
        </div>
      </q-card-section>

      <q-separator />

      <!-- Contact -->
      <q-card-section v-if="activity">
        <div class="text-weight-bold">Contact</div>
        <div class="q-mt-sm">
          <q-item v-if="activity.contact.phone">
            <q-item-section>
              <q-icon name="phone" />
            </q-item-section>
            <q-item-section>{{ activity.contact.phone }}</q-item-section>
          </q-item>
          <q-item v-if="activity.contact.email">
            <q-item-section>
              <q-icon name="email" />
            </q-item-section>
            <q-item-section>{{ activity.contact.email }}</q-item-section>
          </q-item>
          <q-item v-if="activity.contact.website">
            <q-item-section>
              <q-icon name="language" />
            </q-item-section>
            <q-item-section>
              <a :href="activity.contact.website" target="_blank">{{ activity.contact.website }}</a>
            </q-item-section>
          </q-item>
        </div>
        <q-btn
          label="Réserver"
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
          <div class="text-h6">Réserver</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit="submitReservation">
            <!-- Date -->
            <q-input v-model="reservation.date" type="date" label="Date" outlined required />

            <!-- Heure -->
            <!-- <q-input
              v-model="reservation.time"
              type="time"
              label="Heure"
              outlined
              required
              class="q-mt-md"
            /> -->

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
const activity = ref(null)
const fullscreen = ref(false)
const showReservationPopup = ref(false)
const mapContainer = ref(null)
const map = ref()

const reservation = ref({
  date: '',
  // time: '',
  people: '',
  additionalInfo: '',
})

// Retour à la page précédente
const goBack = () => {
  router.back()
}

const submitReservation = () => {
  // console.log('Données de réservation :', reservation.value)
  // Logique d'envoi au backend ici
  reservationStore
    .activityReservation({
      establishmentId: activity.value._id,
      establishmentType: activity.value.type,
      reservationDate: reservation.value.date,
      price: +reservation.value.people * +activity.value.price,
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
        message: `Erreur lors de la réservation: ${error.message}`,
      })
    })
}

const createFavoris = () => {
  establishmentStore.createFavoris(activity.value._id).finally(() => {
    establishmentStore.fetchFavoris()
  })
}

const removeFavoris = () => {
  establishmentStore.removeFavoris(activity.value._id).finally(() => {
    establishmentStore.fetchFavoris()
  })
}

// Propriété calculée pour savoir si l'activité est un favori
const favorite = computed(() => {
  var bool = establishmentStore.favoris.filter(
    (fav) => fav.establishment._id === activity.value?._id,
  )
  return bool.length
})

// Charger les activités à l'affichage de la page
onMounted(() => {
  establishmentStore
    .fetchActivity(route.params.slug)
    .then(() => {
      activity.value = establishmentStore.activity
      if (authStore.user && authStore.token) establishmentStore.fetchFavoris()

      map.value = L.map(mapContainer.value).setView(
        [
          activity.value.location.coordinates.latitude,
          activity.value.location.coordinates.longitude,
        ],
        13,
      )
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value)
      L.marker([
        activity.value.location.coordinates.latitude,
        activity.value.location.coordinates.longitude,
      ])
        .addTo(map.value)
        .bindPopup(`<b>${activity.value.name}</b><br>${activity.value.location.address}`)
        .openPopup()
    })
    .catch(() => {
      // router.push('/404')
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

#mapContainer {
  height: 180px;
}
</style>
