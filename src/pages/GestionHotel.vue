<template>
  <q-page class="bg-grey-2">
    <!-- Header avec bouton retour -->
    <q-toolbar class="bg-primary text-white">
      <q-btn flat icon="arrow_back" color="white" @click="goBack" />
      <q-toolbar-title>Gestion des Hôtels</q-toolbar-title>
    </q-toolbar>

    <!-- Bouton Ajouter Hôtel -->
    <q-card-section class="q-pa-md">
      <q-btn label="Ajouter un Hôtel" color="primary" @click="openAddHotelDialog" />
    </q-card-section>

    <!-- Tableau des hôtels -->
    <q-card-section class="q-pa-md">
      <q-table
        flat
        bordered
        title="Liste des Hôtels"
        :rows="hotels"
        :columns="columns"
        row-key="_id"
      >
        <template v-slot:body-cell-actions="props">
          <q-td align="right">
            <q-btn icon="edit" color="primary" flat dense @click="editHotel(props.row)" />
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

    <!-- Dialog Modifier ou Ajouter -->
    <q-dialog v-model="editDialog">
      <q-card style="width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            {{ selectedHotel._id ? 'Modifier Hôtel' : 'Ajouter Hôtel' }}
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="selectedHotel.name" label="Nom" filled />
          <q-input v-model="selectedHotel.description" label="Description" type="textarea" filled />
          <q-input v-model="selectedHotel.location.address" label="Adresse" filled />
          <q-input v-model="selectedHotel.location.city" label="Ville" filled />
          <q-input
            v-model="selectedHotel.location.coordinates.latitude"
            label="Latitude"
            type="number"
            filled
          />
          <q-input
            v-model="selectedHotel.location.coordinates.longitude"
            label="Longitude"
            type="number"
            filled
          />

          <q-input v-model="selectedHotel.contact.phone" label="Téléphone" filled />
          <q-input v-model="selectedHotel.contact.email" label="Email" filled />
          <q-input v-model="selectedHotel.contact.website" label="Site web" filled />
          <q-input v-model="selectedHotel.capacity" label="Capacité" type="number" filled />
          <q-input
            v-model="selectedHotel.pricePerNight"
            label="Prix par nuit (CFA)"
            type="number"
            filled
          />

          <!-- Images -->
          <div class="text-bold">🖼 Images</div>
          <q-chip
            v-for="(img, index) in selectedHotel.images"
            :key="index"
            removable
            @remove="selectedHotel.images.splice(index, 1)"
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
            v-for="(amenity, index) in selectedHotel.amenities"
            :key="index"
            removable
            @remove="selectedHotel.amenities.splice(index, 1)"
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
          <q-btn label="Sauvegarder" color="primary" @click="saveHotel" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Confirmation Suppression -->
    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="text-h6">Confirmer la suppression</q-card-section>
        <q-card-section> Voulez-vous vraiment supprimer cet hôtel ? </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn label="Supprimer" color="negative" @click="deleteHotel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHotelStore } from 'src/stores/hotelStore'

const hotelStore = useHotelStore()
const hotels = ref([])
const editDialog = ref(false)
const deleteDialog = ref(false)
const selectedHotel = ref({})
const hotelToDelete = ref(null)
const newImage = ref('')
const newAmenity = ref('')
const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const openAddHotelDialog = () => {
  selectedHotel.value = {
    name: '',
    description: '',
    location: { address: '', city: '', coordinates: { latitude: 0, longitude: 0 } },
    contact: { phone: '', email: '', website: '' },
    capacity: 0,
    pricePerNight: 0,
    images: [],
    amenities: [],
  }
  editDialog.value = true
}

const columns = [
  { name: 'name', align: 'left', label: 'Nom', field: 'name' },
  { name: 'location', align: 'left', label: 'Adresse', field: (row) => row.location.address },
  { name: 'city', align: 'left', label: 'Ville', field: (row) => row.location.city },
  { name: 'capacity', align: 'left', label: 'Capacité', field: 'capacity' },
  { name: 'pricePerNight', align: 'left', label: 'Prix par nuit', field: 'pricePerNight' },
  { name: 'actions', align: 'center', label: 'Actions' },
]

onMounted(() => {
  hotelStore.fetchHotels().then(() => {
    hotels.value = hotelStore.hotels
  })
})

const addImage = () => {
  if (newImage.value) {
    selectedHotel.value.images.push(newImage.value)
    newImage.value = ''
  }
}

const addAmenity = () => {
  if (newAmenity.value) {
    selectedHotel.value.amenities.push(newAmenity.value)
    newAmenity.value = ''
  }
}

const editHotel = (hotel) => {
  selectedHotel.value = { ...hotel }
  editDialog.value = true
}

const saveHotel = async () => {
  if (selectedHotel.value._id) {
    await hotelStore.updateHotel(selectedHotel.value)
  } else {
    await hotelStore.addHotel(selectedHotel.value)
  }
  editDialog.value = false
  await hotelStore.fetchHotels().then(() => {
    hotels.value = hotelStore.hotels
  })
}

const confirmDelete = (id) => {
  hotelToDelete.value = id
  deleteDialog.value = true
}

const deleteHotel = async () => {
  if (hotelToDelete.value) {
    await hotelStore.deleteHotel(hotelToDelete.value)
  }
  deleteDialog.value = false
  await hotelStore.fetchHotels().then(() => {
    hotels.value = hotelStore.hotels
  })
}
</script>

<style scoped>
.q-toolbar {
  padding: 0 1rem;
}
</style>
