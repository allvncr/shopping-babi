<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <q-header class="bg-white text-dark q-pa-sm">
      <q-toolbar>
        <div class="row" style="width: 100%; justify-content: space-between">
          <div class="col-8 text-h6">
            <img src="../assets/images/logo_officiel.png" alt="" class="logoEta" />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Hero Section avec Carousel -->
    <q-carousel animated v-model="slide" arrows navigation infinite height="250px">
      <q-carousel-slide
        :name="1"
        img-src="https://shoppingababi.com/wp-content/uploads/2024/09/image-AM-423-424-page-72-73-scaled.jpg"
      />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
      <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
    </q-carousel>

    <!-- Bannière sous le carrousel -->
    <!-- <div class="q-my-md banner row justify-around q-gutter-md q-gutter-sm">
      <img src="../assets/images/Hotel.png" alt="" class="logoEta" @click="goToHotels" />
      <img src="../assets/images/Resto.png" alt="" class="logoEta" @click="goToRestaurants" />
      <img src="../assets/images/Auto.png" alt="" class="logoEta" @click="goToActivities" />
      <img src="../assets/images/Activite.png" alt="" class="logoEta" @click="goToParkings" />
    </div> -->

    <!-- Section Nos Hôtels -->
    <div class="q-my-lg">
      <div class="text-h5 text-weight-bold q-mb-md">
        <img src="../assets/images/Hotel.png" alt="" class="logoEta" />
      </div>
      <q-card
        v-for="(hotel, i) in filterByType('hotel').slice(0, 4)"
        :key="i"
        class="my-card q-mb-md border no-box-shadow"
        @click="viewDetails(hotel)"
      >
        <img :src="hotel.images[0]" alt="Image" class="activity-image" />
        <q-card-section>
          <div class="text-weight-bold">{{ hotel.name }}</div>
          <div class="text-caption text-secondary">
            {{ hotel.location.city }}, {{ hotel.location.address }}
          </div>
        </q-card-section>
      </q-card>
      <q-btn label="Voir plus d'hôtels" color="primary" flat @click="goToHotels" />
    </div>

    <!-- Section Nos Restaurants -->
    <div class="q-my-lg">
      <div class="text-h5 text-weight-bold q-mb-md">
        <img src="../assets/images/Resto.png" alt="" class="logoEta" />
      </div>
      <q-card
        v-for="(restaurant, i) in filterByType('restaurant').slice(0, 4)"
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
      <q-btn label="Voir plus de restaurants" color="primary" flat @click="goToRestaurants" />
    </div>

    <!-- Section Nos Parkings -->
    <div class="q-my-lg">
      <div class="text-h5 text-weight-bold q-mb-md">
        <img src="../assets/images/Auto.png" alt="" class="logoEta" />
      </div>
      <q-card
        v-for="(parking, i) in filterByType('parking').slice(0, 4)"
        :key="i"
        class="my-card q-mb-md border no-box-shadow"
        @click="viewDetails(parking)"
      >
        <img :src="parking.images[0]" alt="Image" class="activity-image" />
        <q-card-section>
          <div class="text-weight-bold">{{ parking.name }}</div>
          <div class="text-caption text-secondary">
            {{ parking.location.city }}, {{ parking.location.address }}
          </div>
        </q-card-section>
      </q-card>
      <q-btn label="Voir plus de parkings" color="primary" flat @click="goToParkings" />
    </div>

    <!-- Section Nos Activités -->
    <div class="q-my-lg">
      <div class="text-h5 text-weight-bold q-mb-md">
        <img src="../assets/images/Activite.png" alt="" class="logoEta" />
      </div>
      <q-card
        v-for="(activity, i) in filterByType('activity').slice(0, 4)"
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
      <q-btn label="Voir plus d'activités" color="primary" flat @click="goToActivities" />
    </div>

    <!-- Footer -->
    <q-footer class="bg-grey-2 q-pa-sm text-center">
      <p>ReservaBabi - 2025 © | Fièrement développé avec le Quasar Framework</p>
    </q-footer>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEstablishmentStore } from 'src/stores/establishmentStore'

const router = useRouter()
const establishmentStore = useEstablishmentStore()

const slide = ref(1)

onMounted(() => {
  establishmentStore.fetchEstablishments()
})

const filterByType = (type) => {
  return establishmentStore.establishments.filter((establishment) => establishment.type === type)
}

const viewDetails = (establishment) => {
  router.push(`/${establishment.type}/${establishment.slug}`)
}

const goToHotels = () => router.push('/search?type=hotels')
const goToRestaurants = () => router.push('/search?type=restaurants')
const goToParkings = () => router.push('/search?type=parkings')
const goToActivities = () => router.push('/search?type=activities')
</script>

<style lang="scss" scoped>
.activity-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.my-card {
  overflow: hidden;
  border-radius: 10px;
}

.q-btn {
  border-radius: 30px;
}

.text-shadow {
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.q-carousel-slide {
  position: relative;
  text-align: center;
}

.logoEta {
  width: 144px;
}
</style>
