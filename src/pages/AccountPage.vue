<template>
  <q-page class="q-pa-md">
    <!-- Non connecté -->
    <div class="text-center" v-if="!authStore.token">
      <q-img
        src="../assets/images/membership.png"
        class="q-mb-lg"
        style="max-width: 80%; margin: auto"
      />
      <q-btn
        unelevated
        color="primary"
        to="/login"
        label="Connectez-vous ou créez un compte"
        class="q-mt-md"
      />
    </div>

    <!-- Connecté -->
    <div v-else>
      <q-card class="q-pa-md q-mb-md shadow-2">
        <q-avatar size="64px" class="q-mb-sm">
          <img
            src="https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-174669.jpg"
            alt="Profile Picture"
          />
        </q-avatar>
        <div class="text-h6 text-primary">
          {{ authStore.user.firstname }} {{ authStore.user.lastname }}
        </div>
        <div class="text-caption text-secondary">
          {{ authStore.user.email }}
        </div>
        <div class="text-caption text-secondary text-weight-bold">
          {{ authStore.user.role }}
        </div>
      </q-card>

      <div class="q-pa-md">
        <q-list bordered separator>
          <!-- Nom -->
          <q-item clickable v-if="!isEdit">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Nom</q-item-label>
              <q-item-label caption>{{ authStore.user.lastname }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-input
            v-if="isEdit"
            v-model="form.lastname"
            label="Nom"
            outlined
            dense
            class="q-mb-md"
          />

          <!-- Prénom -->
          <q-item clickable v-if="!isEdit">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Prénom</q-item-label>
              <q-item-label caption>{{ authStore.user.firstname }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-input
            v-if="isEdit"
            v-model="form.firstname"
            label="Prénom"
            outlined
            dense
            class="q-mb-md"
          />

          <!-- Email -->
          <q-item clickable v-if="!isEdit">
            <q-item-section avatar>
              <q-icon name="email" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Email</q-item-label>
              <q-item-label caption>{{ authStore.user.email }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-input
            v-if="isEdit"
            v-model="form.email"
            label="Email"
            outlined
            dense
            type="email"
            class="q-mb-md"
          />

          <!-- Téléphone -->
          <q-item clickable v-if="!isEdit">
            <q-item-section avatar>
              <q-icon name="phone" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Numéro de portable</q-item-label>
              <q-item-label caption>{{ authStore.user.tel }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-input
            v-if="isEdit"
            v-model="form.tel"
            label="Téléphone"
            outlined
            dense
            type="tel"
            class="q-mb-md"
          />
        </q-list>

        <!-- Boutons -->
        <q-btn
          unelevated
          color="primary"
          label="Modifier"
          class="full-width q-mt-md"
          v-if="!isEdit"
          @click="makeEdit"
        />
        <q-btn
          unelevated
          color="primary"
          label="Enregistrer"
          class="full-width q-mt-md"
          v-if="isEdit"
          :loading="loading"
          @click="handleEdit"
        />
        <q-btn
          unelevated
          color="negative"
          label="Déconnexion"
          class="full-width q-mt-md"
          @click="handleLogout"
        />
        <q-btn
          unelevated
          color="positive"
          label="Historique de reservation"
          class="full-width q-mt-md"
          @click="reservationHistory"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/stores/authStore'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isEdit = ref(false)
const loading = ref(false)

const form = reactive({
  firstname: '',
  lastname: '',
  tel: '',
  email: '',
})

const makeEdit = () => {
  form.firstname = authStore.user.firstname
  form.lastname = authStore.user.lastname
  form.tel = authStore.user.tel
  form.email = authStore.user.email
  isEdit.value = true
}

const handleEdit = () => {
  loading.value = true
  authStore
    .updateUser(form)
    .then(() => {
      loading.value = false
      isEdit.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const reservationHistory = () => {
  router.push('/reservation-history')
}
</script>

<style scoped>
.text-h6 {
  font-size: 18px;
  font-weight: 500;
}

.text-caption {
  font-size: 14px;
  color: #7d7d7d;
}

.q-avatar {
  margin: auto;
}

.q-card {
  text-align: center;
}
</style>
