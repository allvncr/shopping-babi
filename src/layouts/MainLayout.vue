<template>
  <q-layout view="lHh lpr lFf">
    <!-- Contenu principal -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer (fixé en bas) -->
    <q-footer elevated>
      <q-tabs
        v-model="tab"
        class="full-width bg-white text-dark shadow-2"
        dense
        indicator-color="secondary"
        switch-indicator
        align="justify"
        stretch
      >
        <q-tab name="home" icon="home" label="Accueil" @click="navigateTo('/')" />
        <q-tab
          name="recherche"
          icon="travel_explore"
          label="Recherche"
          @click="navigateTo('/search')"
        />
        <q-tab name="favoris" icon="favorite" label="Favoris" @click="navigateTo('/favoris')" />
        <q-tab name="panier" icon="shopping_cart" label="Panier" @click="navigateTo('/panier')" />
        <q-tab name="compte" icon="face" label="Compte" @click="navigateTo('/account')" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tab = ref('home') // Par défaut, "Accueil" est sélectionné

const navigateTo = (route) => {
  router.push(route)
}
</script>

<style lang="scss" scoped>
.full-width {
  width: 100%;
}

.q-tab {
  color: $primary !important; /* Forcer les icônes à être blanches */
}

.q-tab--active {
  color: $secondary !important;
}
</style>
