<template>
  <q-page class="bg-grey-2">
    <!-- Header avec bouton retour -->
    <q-toolbar class="bg-primary text-white">
      <q-btn flat icon="arrow_back" color="white" @click="goBack" />
      <q-toolbar-title>Gestion des Restaurants</q-toolbar-title>
    </q-toolbar>

    <!-- Bouton Ajouter Restaurant -->
    <q-card-section class="q-pa-md">
      <q-btn label="Ajouter un restaurant" color="primary" @click="openAddDialog" />
    </q-card-section>

    <!-- Tableau des restaurants -->
    <q-card-section class="q-pa-md">
      <q-table
        flat
        bordered
        title="Liste des Restaurants"
        :rows="restaurants"
        :columns="columns"
        row-key="_id"
      >
        <template v-slot:body-cell-actions="props">
          <q-td align="right">
            <q-btn icon="edit" color="primary" flat dense @click="editRestaurant(props.row)" />
            <q-btn
              icon="delete"
              color="negative"
              flat
              dense
              @click="confirmDelete(props.row._id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <!-- Dialog Ajouter / Modifier -->
    <q-dialog v-model="editDialog">
      <q-card style="width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            {{ selectedRestaurant._id ? 'Modifier Restaurant' : 'Ajouter Restaurant' }}
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="selectedRestaurant.name" label="Nom" filled />
          <q-input
            v-model="selectedRestaurant.description"
            label="Description"
            type="textarea"
            filled
          />
          <q-input v-model="selectedRestaurant.location.address" label="Adresse" filled />
          <q-input v-model="selectedRestaurant.location.city" label="Ville" filled />
          <q-input
            v-model="selectedRestaurant.location.coordinates.latitude"
            label="Latitude"
            type="number"
            filled
          />
          <q-input
            v-model="selectedRestaurant.location.coordinates.longitude"
            label="Longitude"
            type="number"
            filled
          />
          <q-input
            v-model="selectedRestaurant.openingHours.start"
            label="Heure d'ouverture"
            type="time"
            filled
          />
          <q-input
            v-model="selectedRestaurant.openingHours.end"
            label="Heure de fermeture"
            type="time"
            filled
          />
          <q-input v-model="selectedRestaurant.contact.phone" label="Téléphone" filled />
          <q-input v-model="selectedRestaurant.contact.email" label="Email" filled />
          <q-input v-model="selectedRestaurant.contact.website" label="Site Web" filled />
          <q-input v-model="selectedRestaurant.cuisineType" label="Type de cuisine" filled />

          <!-- Images -->
          <div class="text-bold">🖼 Images</div>
          <q-chip
            v-for="(img, index) in selectedRestaurant.images"
            :key="index"
            removable
            @remove="selectedRestaurant.images.splice(index, 1)"
          >
            {{ img }}
          </q-chip>
          <q-input v-model="newImage" label="Ajouter une image (URL)" filled>
            <template v-slot:append>
              <q-btn icon="add" color="primary" flat @click="addImage" />
            </template>
          </q-input>

          <!-- Équipements -->
          <div class="text-bold">⚙️ Équipements</div>
          <q-chip
            v-for="(amenity, index) in selectedRestaurant.amenities"
            :key="index"
            removable
            @remove="selectedRestaurant.amenities.splice(index, 1)"
          >
            {{ amenity }}
          </q-chip>
          <q-input v-model="newAmenity" label="Ajouter un équipement" filled>
            <template v-slot:append>
              <q-btn icon="add" color="primary" flat @click="addAmenity" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Annuler" color="negative" v-close-popup />
          <q-btn label="Sauvegarder" color="primary" @click="saveRestaurant" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de suppression -->
    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="text-h6">Confirmer la suppression</q-card-section>
        <q-card-section> Voulez-vous vraiment supprimer ce restaurant ? </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn label="Supprimer" color="negative" @click="deleteRestaurant" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRestaurantStore } from 'src/stores/restaurantStore'

const router = useRouter()
const restaurantStore = useRestaurantStore()
const restaurants = ref([])
const editDialog = ref(false)
const deleteDialog = ref(false)
const selectedRestaurant = ref({})
const restaurantToDelete = ref(null)
const newImage = ref('')
const newAmenity = ref('')

const goBack = () => {
  router.go(-1)
}

const openAddDialog = () => {
  selectedRestaurant.value = {
    name: '',
    description: '',
    location: { address: '', city: '', coordinates: { latitude: 0, longitude: 0 } },
    openingHours: { start: '', end: '' },
    contact: { phone: '', email: '', website: '' },
    cuisineType: '',
    images: [],
    amenities: [],
  }
  editDialog.value = true
}

const columns = [
  { name: 'name', align: 'left', label: 'Nom', field: 'name' },
  { name: 'location', align: 'left', label: 'Adresse', field: (row) => row.location.address },
  { name: 'city', align: 'left', label: 'Ville', field: (row) => row.location.city },
  { name: 'cuisineType', align: 'left', label: 'Cuisine', field: 'cuisineType' },
  { name: 'actions', align: 'center', label: 'Actions' },
]

onMounted(async () => {
  await restaurantStore.fetchRestaurants()
  restaurants.value = restaurantStore.restaurants
})

const addImage = () => {
  if (newImage.value) {
    selectedRestaurant.value.images.push(newImage.value)
    newImage.value = ''
  }
}

const addAmenity = () => {
  if (newAmenity.value) {
    selectedRestaurant.value.amenities.push(newAmenity.value)
    newAmenity.value = ''
  }
}

const editRestaurant = (restaurant) => {
  selectedRestaurant.value = { ...restaurant }
  editDialog.value = true
}

const saveRestaurant = async () => {
  if (selectedRestaurant.value._id) {
    await restaurantStore.updateRestaurant(selectedRestaurant.value)
  } else {
    await restaurantStore.addRestaurant(selectedRestaurant.value)
  }
  editDialog.value = false
  await restaurantStore.fetchRestaurants()
  restaurants.value = restaurantStore.restaurants
}

const confirmDelete = (id) => {
  restaurantToDelete.value = id
  deleteDialog.value = true
}

const deleteRestaurant = async () => {
  if (restaurantToDelete.value) {
    await restaurantStore.deleteRestaurant(restaurantToDelete.value)
  }
  deleteDialog.value = false
  await restaurantStore.fetchRestaurants()
  restaurants.value = restaurantStore.restaurants
}
</script>
