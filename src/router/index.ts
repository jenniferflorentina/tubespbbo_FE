import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '@/store/index';

// layouts

import Admin from '@/components/layouts/full-layout/Layout.vue';
import Auth from '@/layouts/Auth.vue';

// views for Admin layout

import Dashboard from '@/views/admin/Dashboard.vue';
import Settings from '@/views/admin/Settings.vue';

// views for Auth layout

import Login from '@/views/LoginPage.vue';
import Register from '@/views/Register.vue';

// views without layouts

import Landing from '@/views/Landing.vue';
import Profile from '@/views/Profile.vue';
import Index from '@/views/user/Index.vue';
import IndexAdmin from '@/views/admin/Index.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/admin',
    component:Admin,
    children: [
      {
        path: '/admin/dashboard',
        component: Dashboard,
      },
      {
        path: '/admin/settings',
        component: Settings,
      },
      {
        path: '/admin/expenses',
        component: () =>
        import(
          /* webpackChunkName: "adminExpenses" */ '@/views/admin/expenses/Index.vue'
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
    path: '/auth',
    component: Auth,
    children: [
      {
        path: '/auth/login',
        component: Login,
      },
      {
        path: '/auth/register',
        component: Register,
      },
    ],
  },
  {
    path: '/landing',
    component: Landing,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/',
    component: Index,
  },
  {
    path: '/admin/index',
    component: IndexAdmin,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
