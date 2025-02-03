const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/HomePage.vue'), name: 'home' },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'search', component: () => import('src/pages/SearchPage.vue'), name: 'search' },
      { path: 'favoris', component: () => import('src/pages/FavorisPage.vue'), name: 'favoris' },
      { path: 'contact', component: () => import('src/pages/ContactPage.vue'), name: 'contact' },
      { path: 'panier', component: () => import('src/pages/CartPage.vue'), name: 'panier' },
      { path: 'account', component: () => import('src/pages/AccountPage.vue'), name: 'account' },
      {
        path: '/activity/:slug',
        name: 'ActivityDetail',
        component: () => import('pages/ActivityDetailPage.vue'),
        props: true,
      },
      {
        path: '/restaurant/:slug',
        name: 'RestaurantDetail',
        component: () => import('pages/RestaurantDetailPage.vue'),
        props: true,
      },
      {
        path: '/hotel/:slug',
        name: 'HotelDetail',
        component: () => import('pages/HotelDetailPage.vue'),
        props: true,
      },
      {
        path: '/parking/:slug',
        name: 'parkingDetail',
        component: () => import('pages/ParkingDetailPage.vue'),
        props: true,
      },
      {
        path: 'reservation-history',
        component: () => import('src/pages/ReservationHistory.vue'),
        name: 'Historique de reservation',
      },
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
