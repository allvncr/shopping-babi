<template>
  <q-page class="bg-grey-2 q-mb-xl">
    <q-header class="bg-white text-dark q-pa-sm">
      <q-toolbar>
        <div class="row">
          <div class="col-8 text-h6">Historique de reservation</div>
          <div class="col-4"></div>
        </div>
      </q-toolbar>
    </q-header>

    <q-list bordered class="q-mt-md">
      <q-item v-for="reservation in reservations" :key="reservation._id" class="q-mb-md">
        <q-card flat bordered class="full-width">
          <q-card-section>
            <span class="text-weight-bold">
              Réservation du {{ formatDate(reservation.createdAt) }}
            </span>
          </q-card-section>

          <!-- Détails de la réservation -->
          <q-card-section>
            <q-item-label class="q-mb-xs">
              <q-btn
                size="sm"
                :color="getStatusColor(reservation.status)"
                label="Afficher les détails"
                @click="reservation.showDetails = !reservation.showDetails"
                :icon="reservation.showDetails ? 'expand_less' : 'expand_more'"
                class="full-width"
              />
            </q-item-label>

            <!-- Détails cachés si showDetails est true -->
            <div v-if="reservation.showDetails">
              <div v-for="item in reservation.items" :key="item._id" class="q-mb-sm">
                <q-img
                  :src="item.establishment.images[0]"
                  class="rounded-borders"
                  width="100%"
                  style="max-height: 200px; object-fit: cover"
                />
                <div class="q-mt-sm">
                  <div class="text-h6">{{ item.establishment.name }}</div>
                  <div>{{ item.establishment.description }}</div>
                  <div><strong>Adresse:</strong> {{ item.establishment.location.address }}</div>
                  <div>
                    <strong>Date de réservation:</strong> {{ formatDate(item.reservationDate) }}
                  </div>
                  <div><strong>Prix:</strong> {{ formatCurrency(item.price) }}</div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Action pour le statut -->
          <q-card-actions align="left">
            <div class="text-subtitle1">
              <strong>Total :</strong> {{ formatCurrency(reservation.totalPrice) }}
            </div>
            <q-badge :color="getStatusColor(reservation.status)" class="q-ml-md">
              {{ reservation.status }}
            </q-badge>

            <!-- Bouton d'annulation en position absolue avec petite icône -->
            <q-btn
              v-if="reservation.status === 'EnCours'"
              label="Annuler la reservation"
              icon="cancel"
              color="negative"
              @click="cancelReservation(reservation._id)"
              size="sm"
              class="q-mt-md full-width"
            />
          </q-card-actions>
        </q-card>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import frLocale from 'date-fns/locale/fr'
import { useReservationStore } from 'src/stores/reservationStore'
import { useQuasar } from 'quasar'
const $q = useQuasar()

const reservationStore = useReservationStore() // Store Pinia
const reservations = ref([])

onMounted(() => {
  // Appelle une méthode API pour récupérer les réservations
  reservationStore.getReservations().then(() => {
    reservations.value = reservationStore.reservations.map((reservation) => ({
      ...reservation,
      showDetails: false, // Ajoute un champ pour contrôler l'affichage des détails
    }))
  })
})

const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'dd MMMM yyyy, H:m', { locale: frLocale })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CFA' }).format(amount)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'EnCours':
      return 'warning'
    case 'Validée':
      return 'positive'
    case 'Annulée':
      return 'negative'
    default:
      return 'grey'
  }
}

// Méthode pour annuler une réservation
const cancelReservation = (reservationId) => {
  reservationStore
    .cancelReservation(reservationId)
    .then(() => {
      $q.dialog({
        title: 'Réservation',
        message: 'Réservation annulée avec succès!',
      }).onOk(() => {
        // Recharger les réservations
        reservationStore.getReservations().then(() => {
          reservations.value = reservationStore.reservations.map((reservation) => ({
            ...reservation,
            showDetails: false,
          }))
        })
      })
    })
    .catch((error) => {
      console.error("Erreur lors de l'annulation de la réservation:", error)
    })
}
</script>

<style scoped>
.q-card {
  background-color: white;
  border-radius: 12px;
}
.rounded-borders {
  border-radius: 8px;
}
.absolute-top-right {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
