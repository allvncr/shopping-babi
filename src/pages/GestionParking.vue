<template>
  <q-page class="bg-grey-2">
    <!-- Header avec bouton retour -->
    <q-toolbar class="bg-primary text-white">
      <q-btn flat icon="arrow_back" color="white" @click="goBack" />
      <q-toolbar-title>Gestion des Parkings</q-toolbar-title>
    </q-toolbar>

    <!-- Bouton Ajouter Parking -->
    <q-card-section class="q-pa-md">
      <q-btn label="Ajouter un parking" color="primary" @click="openAddParkingDialog" />
    </q-card-section>

    <!-- Tableau des parkings -->
    <q-card-section class="q-pa-md">
      <q-table
        flat
        bordered
        title="Liste des Parkings"
        :rows="parkings"
        :columns="columns"
        row-key="_id"
      >
        <template v-slot:body-cell-actions="props">
          <q-td align="right">
            <q-btn icon="edit" color="primary" flat dense @click="editParking(props.row)" />
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
            {{ selectedParking._id ? 'Modifier Parking' : 'Ajouter Parking' }}
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="selectedParking.name" label="Nom" filled />
          <q-input
            v-model="selectedParking.description"
            label="Description"
            type="textarea"
            filled
          />
          <q-input v-model="selectedParking.location.address" label="Adresse" filled />
          <q-input v-model="selectedParking.location.city" label="Ville" filled />
          <q-input
            v-model="selectedParking.location.coordinates.latitude"
            label="Latitude"
            type="number"
            filled
          />
          <q-input
            v-model="selectedParking.location.coordinates.longitude"
            label="Longitude"
            type="number"
            filled
          />

          <q-input
            v-model="selectedParking.openingHours.start"
            label="Heure début"
            type="time"
            filled
          />
          <q-input
            v-model="selectedParking.openingHours.end"
            label="Heure fin"
            type="time"
            filled
          />
          <q-input v-model="selectedParking.contact.phone" label="Téléphone" filled />
          <q-input v-model="selectedParking.contact.email" label="Email" filled />
          <q-input v-model="selectedParking.contact.website" label="Site web" filled />
          <q-input
            v-model="selectedParking.pricePerHour"
            label="Tarif par heure (CFA)"
            type="number"
            filled
          />

          <!-- Images -->
          <div class="text-bold">🖼 Images</div>
          <q-chip
            v-for="(img, index) in selectedParking.images"
            :key="index"
            removable
            @remove="selectedParking.images.splice(index, 1)"
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
            v-for="(amenity, index) in selectedParking.amenities"
            :key="index"
            removable
            @remove="selectedParking.amenities.splice(index, 1)"
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
          <q-btn label="Sauvegarder" color="primary" @click="saveParking" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Confirmation Suppression -->
    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="text-h6">Confirmer la suppression</q-card-section>
        <q-card-section> Voulez-vous vraiment supprimer ce parking ? </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn label="Supprimer" color="negative" @click="deleteParking" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useParkingStore } from 'src/stores/parkingStore'

const parkingStore = useParkingStore()
const parkings = ref([])
const editDialog = ref(false)
const deleteDialog = ref(false)
const selectedParking = ref({})
const parkingToDelete = ref(null)
const newImage = ref('')
const newAmenity = ref('')
const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const openAddParkingDialog = () => {
  selectedParking.value = {
    name: '',
    description: '',
    location: { address: '', city: '', coordinates: { latitude: 0, longitude: 0 } },
    openingHours: { start: '', end: '' },
    contact: { phone: '', email: '', website: '' },
    pricePerHour: '',
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
  { name: 'pricePerHour', align: 'left', label: 'Tarif par heure', field: 'pricePerHour' },
  { name: 'actions', align: 'center', label: 'Actions' },
]

onMounted(() => {
  parkingStore.fetchParkings().then(() => {
    parkings.value = parkingStore.parkings
  })
})
const addImage = () => {
  if (newImage.value) {
    selectedParking.value.images.push(newImage.value)
    newImage.value = ''
  }
}

const addAmenity = () => {
  if (newAmenity.value) {
    selectedParking.value.amenities.push(newAmenity.value)
    newAmenity.value = ''
  }
}

const editParking = (parking) => {
  selectedParking.value = { ...parking }
  editDialog.value = true
}

const saveParking = async () => {
  if (selectedParking.value._id) {
    await parkingStore.updateParking(selectedParking.value)
  } else {
    await parkingStore.addParking(selectedParking.value)
  }
  editDialog.value = false
  await parkingStore.fetchParkings().then(() => {
    parkings.value = parkingStore.parkings
  })
}

const confirmDelete = (id) => {
  parkingToDelete.value = id
  deleteDialog.value = true
}

const deleteParking = async () => {
  if (parkingToDelete.value) {
    await parkingStore.deleteParking(parkingToDelete.value)
  }
  deleteDialog.value = false
  await parkingStore.fetchParkings().then(() => {
    parkings.value = parkingStore.parkings
  })
}
</script>

<style scoped>
.q-toolbar {
  padding: 0 1rem;
}
</style>
