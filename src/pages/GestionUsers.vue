<template>
  <q-page class="bg-grey-2">
    <!-- Header avec bouton retour -->
    <q-toolbar class="bg-primary text-white">
      <q-btn flat icon="arrow_back" color="white" @click="goBack" />
      <q-toolbar-title>Gestion des Utilisateurs</q-toolbar-title>
    </q-toolbar>

    <!-- Bouton Ajouter Utilisateur -->
    <q-card-section class="q-pa-md">
      <q-btn label="Ajouter un utilisateur" color="primary" @click="openAddUserDialog" />
    </q-card-section>

    <!-- Tableau des utilisateurs -->
    <q-card-section class="q-pa-md">
      <q-table
        flat
        bordered
        title="Liste des Utilisateurs"
        :rows="users"
        :columns="columns"
        row-key="name"
      >
        <template v-slot:body-cell-actions="props">
          <q-td align="right">
            <q-btn icon="edit" color="primary" flat dense @click="editUser(props.row)" />
            <q-btn icon="delete" color="negative" flat dense @click="deleteUser(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <!-- Dialog pour modifier un utilisateur -->
    <q-dialog v-model="editDialog">
      <q-card style="width: 400px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            {{ isEditing ? 'Modifier Utilisateur' : 'Ajouter un Utilisateur' }}
          </div>
        </q-card-section>

        <q-form @submit.prevent="saveUser">
          <q-card-section class="q-gutter-md">
            <q-input v-model="user.firstname" label="Prénom" filled required />
            <q-input v-model="user.lastname" label="Nom" filled required />
            <q-input v-model="user.email" label="Email" filled type="email" required />
            <q-input v-model="user.tel" label="Téléphone" filled type="tel" required />
            <q-input
              v-if="!isEditing"
              v-model="user.password"
              label="Mot de passe"
              filled
              type="password"
              :required="!isEditing"
            />

            <q-select
              v-model="user.role"
              :options="['proprio', 'superAdmin', 'client']"
              label="Rôle"
              filled
            />

            <q-select
              v-if="user.role == 'proprio'"
              v-model="user.establishmentTypes"
              :options="['Hotel', 'Restaurant', 'Activité', 'Parking']"
              label="Gestion établissements"
              filled
              multiple
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Annuler" color="negative" v-close-popup />
            <q-btn label="Sauvegarder" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import { useRouter } from 'vue-router'

const userStore = useAuthStore()
const users = ref([])
const editDialog = ref(false)
const isEditing = ref(false)
const user = ref({
  firstname: null,
  lastname: null,
  email: null,
  tel: null,
  role: null,
  establishmentTypes: [],
  password: null,
})
const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const openAddUserDialog = () => {
  isEditing.value = false

  user.value = {
    firstname: null,
    lastname: null,
    email: null,
    tel: null,
    role: null,
    establishmentTypes: [],
    password: null,
  }
  editDialog.value = true
}

const saveUser = () => {
  if (!isEditing.value) {
    userStore.register(user.value).then(() => {
      init()
    })
  } else {
    userStore.updateUserByID(user.value).then(() => {
      init()
    })
  }
}

const columns = [
  { name: 'firstname', align: 'left', label: 'Prenom', field: 'firstname' },
  { name: 'lastname', align: 'left', label: 'Nom', field: 'lastname' },
  { name: 'email', align: 'left', label: 'Email', field: 'email' },
  { name: 'tel', align: 'left', label: 'Téléphone', field: 'tel' },
  { name: 'role', align: 'left', label: 'Role', field: 'role' },
  { name: 'actions', align: 'center', label: 'Actions' },
]

const init = () => {
  userStore.getAllUsers().then(() => {
    users.value = userStore.users.map((user) => {
      return {
        ...user,
      }
    })
    editDialog.value = false
    isEditing.value = false
  })
}

onMounted(() => {
  init()
})

const editUser = (selectedUser) => {
  isEditing.value = true
  Object.assign(user.value, {
    id: selectedUser._id,
    firstname: selectedUser.firstname,
    lastname: selectedUser.lastname,
    email: selectedUser.email,
    tel: selectedUser.tel,
    role: selectedUser.role,
    establishmentTypes: selectedUser.establishmentTypes,
  })
  editDialog.value = true
}

const deleteUser = async (selectedUser) => {
  await userStore.deleteUserByID(selectedUser._id).then(() => {
    init()
  })
}
</script>

<style scoped>
.q-toolbar {
  padding: 0 1rem;
}
</style>
