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
    <div class="q-mb-xl">
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

      <q-separator />

      <!-- <div class="q-px-md">
        <div ref="mapContainer" style="height: 270px"></div>
      </div> -->

      <q-tabs
        v-model="tab"
        dense
        class="q-mb-md"
        align="justify"
        active-color="primary"
        indicator-color="primary"
      >
        <q-tab name="description" label="Description" />
        <q-tab name="menu" label="Menu" />
      </q-tabs>

      <!-- Tab Description -->
      <q-tab-panels v-model="tab">
        <q-tab-panel name="description">
          <!-- Informations principales -->
          <q-card-section v-if="restaurant">
            <div class="text-h6 text-weight-bold">{{ restaurant.name }}</div>
            <p class="text-secondary">{{ restaurant.description }}</p>
            <div class="text-weight-bold">Localisation</div>
            <div class="text-caption text-primary">
              {{ restaurant.location.city }}, {{ restaurant.location.address }}
            </div>
          </q-card-section>
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

            <q-btn
              label="Réserver une table"
              color="primary"
              unelevated
              class="full-width"
              @click="onReserve"
            />
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name="menu">
          <!-- Menu -->
          <div class="product-container" v-if="restaurant?.menu?.length">
            <div class="product-card" v-for="(dish, index) in restaurant.menu" :key="index">
              <img :src="dish.image" alt="Panier de Pains" />
              <div class="product-info">
                <h3>{{ dish.name }}</h3>
                <p class="discounted-price">{{ dish.price }} Fcfa</p>
                <input type="number" min="0" class="quantity-input" v-model="dish.quantity" />
              </div>
            </div>
          </div>
          <q-btn
            :label="`Passer une commande (${restaurant.menu.reduce((total, dish) => total + dish.price * dish.quantity, 0)} Fcfa)`"
            color="primary"
            unelevated
            class="full-width"
            @click="onReserve"
          />
        </q-tab-panel>
      </q-tab-panels>
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
import { useReservationStore } from 'src/stores/reservationStore'
// import L from 'leaflet'
import { useQuasar } from 'quasar'
const $q = useQuasar()

const establishmentStore = useEstablishmentStore()
const authStore = useAuthStore()
const reservationStore = useReservationStore()

const route = useRoute()
const router = useRouter()

const slide = ref(0)
const restaurant = ref(null)
const fullscreen = ref(false)
// const mapContainer = ref(null)
// const map = ref()
const tab = ref('description')

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
  showReservationPopup.value = true
}

const submitReservation = () => {
  showReservationPopup.value = false
  // Logique d'envoi au backend ici
  reservationStore
    .activityReservation({
      establishmentId: restaurant.value._id,
      establishmentType: restaurant.value.type,
      reservationStartDate: reservation.value.date,
      reservationStartTime: reservation.value.time,
      people: +reservation.value.people,
      additionalInfo: reservation.value.additionalInfo,
      price: restaurant.value.menu.reduce((total, dish) => total + dish.price * dish.quantity, 0),
      menu: restaurant.value.menu.filter((dish) => dish.quantity > 0),
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
      restaurant.value = {
        ...establishmentStore.restaurant,
        menu: establishmentStore.restaurant.menu.map((dish) => ({
          ...dish,
          quantity: 0,
        })),
      }
      if (authStore.user && authStore.token) establishmentStore.fetchFavoris()

      // map.value = L.map(mapContainer.value).setView(
      //   [
      //     restaurant.value.location.coordinates.latitude,
      //     restaurant.value.location.coordinates.longitude,
      //   ],
      //   13,
      // )
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   attribution:
      //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      // }).addTo(map.value)
      // L.marker([
      //   restaurant.value.location.coordinates.latitude,
      //   restaurant.value.location.coordinates.longitude,
      // ])
      //   .addTo(map.value)
      //   .bindPopup(`<b>${restaurant.value.name}</b><br>${restaurant.value.location.address}`)
      //   .openPopup()
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

.product-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 8px;
  gap: 15px;
}

.product-card img {
  width: 100px; /* Ajuster la taille de l'image */
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.product-info h3 {
  font-size: 18px;
  color: #333;
  margin: 0;
  line-height: 1;
}

.discounted-price {
  color: #e74c3c;
  font-size: 16px;
  font-weight: bold;
  margin: 4px 0;
}

.quantity-input {
  // display: block;
  // width: 40px;
  // padding: 5px;
  // font-size: 16px;
  // margin-right: 10px;
  cursor: pointer;
  font-size: 16px;
  border: 1px solid #ccc;
  outline: none;
  text-align: center;
  padding: 5px;
}

.add-to-cart {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.add-to-cart:hover {
  background-color: #27ae60;
}
</style>
