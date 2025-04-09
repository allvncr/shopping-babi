<template>
  <q-page class="bg-grey-2">
    <!-- Header avec bouton retour -->
    <q-toolbar class="bg-primary text-white">
      <q-btn flat icon="arrow_back" color="white" @click="goBack" />
      <q-toolbar-title>Gestion des Activités</q-toolbar-title>
    </q-toolbar>

    <!-- Bouton Ajouter Activité -->
    <q-card-section class="q-pa-md">
      <q-btn label="Ajouter une activité" color="primary" @click="openAddActivityDialog" />
    </q-card-section>

    <!-- Tableau des activités -->
    <q-card-section class="q-pa-md">
      <q-table
        flat
        bordered
        title="Liste des Activités"
        :rows="activities"
        :columns="columns"
        row-key="_id"
      >
        <template v-slot:body-cell-actions="props">
          <q-td align="right">
            <q-btn icon="edit" color="primary" flat dense @click="editActivity(props.row)" />
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
      <q-card style="width: 600px">
        <!-- Titre -->
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            {{ selectedActivity._id ? 'Modifier Activité' : 'Ajouter Activité' }}
          </div>
        </q-card-section>

        <q-form @submit.prevent="saveActivity">
          <q-card-section class="q-gutter-md">
            <!-- Infos générales -->
            <q-input v-model="selectedActivity.name" label="Nom de l'activité" filled required />
            <q-input
              v-model="selectedActivity.description"
              label="Description"
              filled
              type="textarea"
              required
            />

            <!-- Localisation -->
            <div class="text-bold">📍 Localisation</div>
            <q-input v-model="selectedActivity.location.address" label="Adresse" filled required />
            <q-input v-model="selectedActivity.location.city" label="Ville" filled required />
            <q-input
              v-model="selectedActivity.location.coordinates.latitude"
              label="Latitude"
              type="number"
              filled
              required
            />
            <q-input
              v-model="selectedActivity.location.coordinates.longitude"
              label="Longitude"
              type="number"
              filled
              required
            />

            <!-- Images -->
            <div class="text-bold">🖼 Images</div>
            <q-chip
              v-for="(img, index) in selectedActivity.images"
              :key="index"
              removable
              @remove="selectedActivity.images.splice(index, 1)"
            >
              {{ img }}
            </q-chip>
            <q-input v-model="newImage" label="Ajouter une image (URL)" filled>
              <template v-slot:append>
                <q-btn icon="add" color="primary" flat @click="addImage" />
              </template>
            </q-input>

            <!-- Contact -->
            <div class="text-bold">☎️ Contact</div>
            <q-input v-model="selectedActivity.contact.phone" label="Téléphone" filled required />
            <q-input v-model="selectedActivity.contact.email" label="Email" filled type="email" />
            <q-input v-model="selectedActivity.contact.website" label="Site Web" filled />

            <!-- Détails de l'activité -->
            <div class="text-bold">⏳ Détails</div>
            <q-input v-model="selectedActivity.duration" label="Durée" filled />
            <q-input
              v-model="selectedActivity.price"
              label="Prix (CFA)"
              type="number"
              filled
              required
            />
            <q-input
              v-model="selectedActivity.openingHours.start"
              label="Heure début"
              type="time"
              filled
            />
            <q-input
              v-model="selectedActivity.openingHours.end"
              label="Heure fin"
              type="time"
              filled
            />

            <!-- Équipements -->
            <div class="text-bold">⚙️ Équipements</div>
            <q-chip
              v-for="(amenity, index) in selectedActivity.amenities"
              :key="index"
              removable
              @remove="selectedActivity.amenities.splice(index, 1)"
            >
              {{ amenity }}
            </q-chip>
            <q-input v-model="newAmenity" label="Ajouter un équipement" filled>
              <template v-slot:append>
                <q-btn icon="add" color="primary" flat @click="addAmenity" />
              </template>
            </q-input>

            <!-- Public ciblé -->
            <div class="text-bold">👥 Public ciblé</div>
            <q-chip
              v-for="(target, index) in selectedActivity.suitableFor"
              :key="index"
              removable
              @remove="selectedActivity.suitableFor.splice(index, 1)"
            >
              {{ target }}
            </q-chip>
            <q-input v-model="newTarget" label="Ajouter un public ciblé" filled>
              <template v-slot:append>
                <q-btn icon="add" color="primary" flat @click="addTarget" />
              </template>
            </q-input>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Annuler" color="negative" v-close-popup />
            <q-btn label="Sauvegarder" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Dialog Confirmation Suppression -->
    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="text-h6">Confirmer la suppression</q-card-section>
        <q-card-section> Voulez-vous vraiment supprimer cette activité ? </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn label="Supprimer" color="negative" @click="deleteActivity" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useActivityStore } from 'src/stores/activityStore'

const activityStore = useActivityStore()
const activities = ref([])
const editDialog = ref(false)
const deleteDialog = ref(false)
const selectedActivity = ref({})
const activityToDelete = ref(null)

const newImage = ref('')
const newAmenity = ref('')
const newTarget = ref('')
const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const openAddActivityDialog = () => {
  selectedActivity.value = {
    name: '',
    description: '',
    location: { address: '', city: '', coordinates: { latitude: 0, longitude: 0 } },
    images: [],
    contact: { phone: '', email: '', website: '' },
    duration: '',
    price: 0,
    openingHours: { start: '', end: '' },
    amenities: [],
    suitableFor: [],
  }
  editDialog.value = true
}

const columns = [
  { name: 'name', align: 'left', label: 'Nom', field: 'name' },
  { name: 'location', align: 'left', label: 'Adresse', field: (row) => row.location.address },
  { name: 'city', align: 'left', label: 'Ville', field: (row) => row.location.city },
  { name: 'price', align: 'left', label: 'Prix', field: 'price' },
  { name: 'actions', align: 'center', label: 'Actions' },
]

const addImage = () => {
  if (newImage.value) {
    selectedActivity.value.images.push(newImage.value)
    newImage.value = ''
  }
}

const addAmenity = () => {
  if (newAmenity.value) {
    selectedActivity.value.amenities.push(newAmenity.value)
    newAmenity.value = ''
  }
}

const addTarget = () => {
  if (newTarget.value) {
    selectedActivity.value.suitableFor.push(newTarget.value)
    newTarget.value = ''
  }
}

onMounted(async () => {
  await fetchActivities()
})

const fetchActivities = async () => {
  await activityStore.fetchActivities()
  activities.value = activityStore.activities
}

const editActivity = (activity) => {
  selectedActivity.value = {
    name: '',
    description: '',
    price: '',
    duration: '',
    openingHours: { start: '', end: '' },
    location: { address: '', city: '', coordinates: { latitude: 0, longitude: 0 } },
    amenities: '',
    suitableFor: '',
    ...activity,
  }
  editDialog.value = true
}

const saveActivity = async () => {
  if (selectedActivity.value._id) {
    await activityStore.updateActivityByID(selectedActivity.value)
  } else {
    await activityStore.addActivity(selectedActivity.value)
  }
  editDialog.value = false
  await fetchActivities()
}

const confirmDelete = (id) => {
  activityToDelete.value = id
  deleteDialog.value = true
}

const deleteActivity = async () => {
  if (activityToDelete.value) {
    await activityStore.deleteActivity(activityToDelete.value)
  }
  deleteDialog.value = false
  await fetchActivities()
}
</script>

<style scoped>
.q-toolbar {
  padding: 0 1rem;
}
</style>
