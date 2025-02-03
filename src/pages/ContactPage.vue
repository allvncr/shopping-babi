<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <q-header class="bg-white text-dark q-pa-sm">
      <q-toolbar>
        <div class="row">
          <div class="col-12 text-h6">Contactez-nous</div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <div class="q-my-lg">
      <div class="text-h5 text-center q-mb-md">Nous sommes là pour vous aider</div>
      <p class="text-subtitle2 text-center">
        N'hésitez pas à nous poser vos questions, nous vous répondrons dans les plus brefs délais.
      </p>
    </div>

    <!-- Contact Form -->
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-input
        outlined
        label="Votre nom"
        v-model="form.name"
        :rules="[(val) => (val && val.length > 0) || 'Nom requis']"
        dense
      />

      <q-input
        outlined
        label="Votre email"
        v-model="form.email"
        :rules="[(val) => (val && val.length > 0) || 'Email requis']"
        dense
      />

      <q-input
        outlined
        label="Votre message"
        v-model="form.message"
        type="textarea"
        :rules="[(val) => (val && val.length > 0) || 'Message requis']"
        dense
      />

      <q-btn label="Envoyer" type="submit" color="primary" class="full-width" />
    </q-form>

    <!-- Success or Error Message -->
    <div v-if="submissionStatus" class="q-my-md text-center">
      <q-banner :class="submissionStatus.success ? 'bg-green' : 'bg-negative'">
        <div class="text-white">{{ submissionStatus.message }}</div>
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: '',
})

const submissionStatus = ref(null)

const submitForm = async () => {
  // Simuler une soumission (ici, vous pouvez appeler un service pour envoyer l'email)
  // Par exemple, vous pouvez utiliser un service comme EmailJS ou un API pour traiter cette soumission

  // Simuler la soumission avec succès
  submissionStatus.value = {
    success: true,
    message: 'Votre message a été envoyé avec succès. Nous vous répondrons bientôt.',
  }

  // Réinitialiser le formulaire
  form.value.name = ''
  form.value.email = ''
  form.value.message = ''
}
</script>

<style lang="scss">
.q-btn {
  border-radius: 25px;
}

.q-banner {
  border-radius: 10px;
}

.q-form {
  max-width: 500px;
  margin: 0 auto;
}
</style>
