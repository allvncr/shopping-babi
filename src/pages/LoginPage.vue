<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md shadow-2 rounded-borders">
      <img src="../assets/images/logo_officiel.png" alt="" class="logoEta" />
      <q-card-section>
        <div class="text-h5 text-bold text-dark text-center">Se connecter</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            dense
            color="primary"
            :rules="[
              (val) => !!val || 'L\' email est requis',
              (val) => /.+@.+\..+/.test(val) || 'L\' email doit être valide',
            ]"
          />

          <q-input
            v-model="form.password"
            label="Mot de passe"
            :type="isPwd ? 'password' : 'text'"
            outlined
            dense
            color="primary"
            :rules="[(val) => !!val || 'Ce champ est requis']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="flex flex-center q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="Se connecter"
              size="md"
              unelevated
              class="full-width"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    <q-banner v-if="authStore.error" class="q-mt-md" color="negative">
      {{ authStore.error }}
    </q-banner>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const isPwd = ref(true)

const handleLogin = async () => {
  await authStore.login(form.email, form.password)
  if (authStore.token) {
    // Rediriger vers une autre page, si nécessaire
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.logoEta {
  width: 144px;
  margin: auto;
}
</style>
