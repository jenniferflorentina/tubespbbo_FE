/* eslint-disable no-param-reassign */
import axios from 'axios';
// eslint-disable-next-line import/no-cycle
import store from '@/store';

const UNAUTHORIZED = 401;

const ax = axios.create();
ax.interceptors.request.use(
  async (config) => {
    const { token } = store.getters;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Headers'] = '*';

    return config;
  },
  (error) => Promise.reject(error)
);

ax.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { status } = error.response;

    if (status === UNAUTHORIZED) {
      await store.dispatch('signOut');
      return Promise.resolve();
    }

    return Promise.reject(error);
  }
);

export default ax;
