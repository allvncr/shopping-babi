<template>
  <q-page class="q-pa-md q-mb-md">
    <!-- Header -->
    <q-header class="bg-white text-dark q-pa-sm">
      <q-toolbar>
        <div class="row">
          <div class="col-12 text-h6">Mon panier</div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Cart Items -->
    <div v-if="cart && cart.items.length" class="q-my-md">
      <q-card
        v-for="(item, index) in cart.items"
        :key="item._id"
        class="my-card q-mb-md border no-box-shadow"
        @click="viewDetails(item)"
      >
        <img :src="item.establishment.images[0]" alt="Image" class="activity-image" />

        <q-card-section class="row no-wrap items-center">
          <div class="col text-left">
            <div class="text-weight-bold">{{ item.establishment.name }}</div>
            <div class="text-caption text-secondary">
              {{ item.establishment.description }}
            </div>
            <div class="text-caption text-grey">
              Adresse : {{ item.establishment.location.address }}
            </div>
            <div class="text-caption text-grey">Prix : {{ item.price }} CFA</div>
            <div class="text-caption text-grey">
              Date de réservation : {{ formatDate(item.reservationStartDate) }}
            </div>
          </div>
          <q-btn flat icon="delete" color="negative" @click.stop="removeItem(index)" />
        </q-card-section>
      </q-card>

      <!-- Total -->
      <div class="text-right text-h6 q-my-md">Total : {{ cart.totalPrice }} CFA</div>
      <q-btn
        label="Valider la commande"
        color="primary"
        unelevated
        class="full-width"
        @click="checkout"
      />
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center text-grey-7 q-pa-md">
      <q-icon name="shopping_cart" size="5rem" class="q-my-md" />
      <div class="text-h6">Votre panier est vide</div>
      <q-btn label="Retour aux activités" color="primary" flat @click="goToProducts" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReservationStore } from 'src/stores/reservationStore'
import { useQuasar } from 'quasar'
const $q = useQuasar()

const reservationStore = useReservationStore() // Store Pinia

const cart = ref(null)

const router = useRouter()

// Afficher plus de détails sur une activité
const viewDetails = (item) => {
  // Rediriger ou afficher un modal avec plus d'informations

  if (item.establishment.type == 'Activité') router.push('/activity/' + item.establishment.slug)
  else if (item.establishment.type == 'Restaurant')
    router.push('/restaurant/' + item.establishment.slug)
  else if (item.establishment.type == 'Hotel') router.push('/hotel/' + item.establishment.slug)
  else if (item.establishment.type == 'Parking') router.push('/parking/' + item.establishment.slug)
}

const goToProducts = () => router.push('/search')
const removeItem = (index) => {
  reservationStore.removePanier(cart.value.items[index]._id).then(() => {
    cart.value.items.splice(index, 1)
    cart.value.totalPrice = cart.value.items.reduce((total, item) => total + item.price, 0)
  })
}
const checkout = () => {
  reservationStore.checkout().then(() => {
    cart.value.items = []
    cart.value.totalPrice = 0
    $q.dialog({
      title: 'Réservation',
      message: 'Réservation réussie!',
    }).onOk(() => {
      router.push('/reservation-history')
    })
  })
}
const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

onMounted(() => {
  reservationStore.getPanier().then(() => {
    cart.value = reservationStore.panier
  })
})
</script>

<style lang="scss">
.my-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.border {
  border-radius: 10px;
}

.text-right {
  text-align: right;
}

.full-width {
  width: 100%;
}
</style>
