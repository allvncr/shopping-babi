<template>
  <q-layout view="lHh lpr lFf">
    <!-- Contenu principal -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer (fixé en bas) -->
  </q-layout>
</template>

<script setup></script>

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
