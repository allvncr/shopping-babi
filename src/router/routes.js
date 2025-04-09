const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/HomePage.vue'), name: 'home' },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: '/admin/users', component: () => import('pages/GestionUsers.vue') },
      { path: '/admin/activities', component: () => import('pages/GestionActivites.vue') },
      { path: '/admin/parkings', component: () => import('pages/GestionParking.vue') },
      { path: '/admin/hotels', component: () => import('pages/GestionHotel.vue') },
      { path: '/admin/restaurants', component: () => import('pages/GestionRestaurant.vue') },
      { path: '/admin/reservations', component: () => import('pages/GestionReservation.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
