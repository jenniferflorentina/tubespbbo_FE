import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

// layouts

import Admin from '@/components/layouts/full-layout/Layout.vue';
import User from '@/components/layouts/full-layout-user/Layout.vue';

// views for Auth layout

import Login from '@/views/LoginPage.vue';
import Register from '@/views/Register.vue';

// views without layouts
import LandingPage from '@/views/Landing.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/admin',
    component: Admin,
    children: [
      {
        path: '/admin/index',
        component: () =>
          import(
            /* webpackChunkName: "adminIndex" */ '@/views/admin/Index.vue'
          ),
      },
      {
        path: '/admin/expenses',
        component: () =>
          import(
            /* webpackChunkName: "adminExpenses" */ '@/views/admin/expenses/Index.vue'
          ),
      },
      {
        path: '/admin/transactions',
        component: () =>
          import(
            /* webpackChunkName: "adminIndex" */ '@/views/admin/transactions/Index.vue'
          ),
      },
      {
        path: '/admin/products',
        component: () =>
          import(
            /* webpackChunkName: "adminProducts" */ '@/views/admin/products/Index.vue'
          ),
      },
    ],
  },
  {
    path: '/user',
    component: User,
    children: [
      {
        path: '/user/index',
        component: () =>
          import(/* webpackChunkName: "adminIndex" */ '@/views/user/Index.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/',
    component: LandingPage,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
