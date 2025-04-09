<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md shadow-2 rounded-borders">
      <img src="../assets/images/logo_officiel.png" alt="" class="logoEta" />
      <q-card-section>
        <div class="text-h5 text-bold text-dark text-center">Inscription</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleRegister" class="q-gutter-md">
          <q-input
            v-model="form.lastname"
            label="Nom"
            outlined
            dense
            color="primary"
            :rules="[(val) => !!val || 'Le nom est requis']"
          />
          <q-input
            v-model="form.firstname"
            label="Prénom"
            outlined
            dense
            color="primary"
            :rules="[(val) => !!val || 'Le prénom est requis']"
          />

          <q-input
            v-model="form.tel"
            label="Téléphone"
            outlined
            type="tel"
            color="primary"
            dense
            :rules="[(val) => !!val || 'Le numéro de téléphone est requis']"
          />

          <q-input
            v-model="form.email"
            label="Email"
            outlined
            type="email"
            color="primary"
            dense
            :rules="[
              (val) => !!val || 'L\'email est requis',
              (val) => /.+@.+\..+/.test(val) || 'L\'email doit être valide',
            ]"
          />
          <q-input
            v-model="form.password"
            label="Mot de passe"
            :type="isPwd ? 'password' : 'text'"
            outlined
            dense
            color="primary"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input
            v-model="form.confirmPassword"
            label="Confirm Password"
            :type="isPwd ? 'password' : 'text'"
            outlined
            dense
            color="primary"
            :rules="[
              (val) => !!val || 'La confirmation du mot de passe est requise',
              (val) => val === form.password || 'Les mots de passe doivent correspondre',
            ]"
          />

          <q-checkbox
            v-model="agreeTerms"
            label="J'accepte la confidentialité et la politique"
            color="primary"
          />

          <div class="flex flex-center q-mt-md">
            <q-btn
              type="submit"
              :loading="loading"
              color="primary"
              label="S'inscrire"
              size="md"
              :disabled="!agreeTerms"
              unelevated
              class="full-width"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center">
        Vous avez déjà un compte ?
        <a href="/login" class="text-primary text-bold">Se connecter</a>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const loading = ref(false)
const router = useRouter()

const form = reactive({
  firstname: '',
  lastname: '',
  tel: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const agreeTerms = ref(false)
const isPwd = ref(true)

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    authStore.error = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true

  const userData = {
    firstname: form.firstname,
    lastname: form.lastname,
    email: form.email,
    tel: form.tel,
    password: form.password,
  }

  await authStore
    .register(userData)
    .then(() => {
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })

  if (!authStore.error) {
    // Rediriger ou effectuer une action après l'inscription réussie
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.logoEta {
  width: 144px;
  margin: auto;
}
</style>
