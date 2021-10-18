// eslint-ignore-file
import { ActionContext } from 'vuex';
import BaseService from '@/services/Base';
import AuthService from '@/services/Auth';

interface AuthModule {
  token: string;
  authenticatedUser: any;
}

const data = (): AuthModule => ({
  token: localStorage.getItem('token') as string,
  authenticatedUser: JSON.parse(
    localStorage.getItem('authenticatedUser') as any
  ),
});

const getters = {
  token: (state: AuthModule) => state.token,
  authenticatedUser: (state: AuthModule) => state.authenticatedUser,
};

const actions = {
  signIn: async (
    { commit, dispatch }: ActionContext<AuthModule, never>,
    payload: {}
  ) => {
    const authService = new AuthService('/auth/signin');
    const res = await authService.post(payload);
    await commit('setToken', res.token);
    await dispatch('getAuthorizationUser');
  },
  signOut: async ({ commit }: ActionContext<AuthModule, never>) => {
    commit('setToken', null);
    localStorage.removeItem('token');
    commit('setAuthenticatedUser', null);
    localStorage.removeItem('authenticatedUser');
    window.location.href = '/';
  },
  getAuthorizationUser: async ({
    commit,
  }: ActionContext<AuthModule, never>) => {
    const userService = new BaseService('/auth/me');
    const resUser = await userService.get('');
    commit('setAuthenticatedUser', resUser);
  },
  forgotPassword: async ({}: ActionContext<AuthModule, never>, payload: {}) => {
    const authService = new AuthService('/auth/forgot-password');
    await authService.post(payload);
    return true;
  },
  resetPasswordValidation: async (
    {}: ActionContext<AuthModule, never>,
    params: ''
  ) => {
    const authService = new AuthService('/auth/reset-password');
    await authService.get(params);
    return true;
  },
  resetPassword: async ({}: ActionContext<AuthModule, never>, payload: {}) => {
    const authService = new AuthService('/auth/reset-password');
    await authService.put(payload);
    return true;
  },
};

const mutations = {
  setToken: (state: AuthModule, token: string) => {
    state.token = token;
    localStorage.setItem('token', token);
  },
  setAuthenticatedUser: (state: AuthModule, authenticatedUser) => {
    state.authenticatedUser = authenticatedUser;
    localStorage.setItem(
      'authenticatedUser',
      JSON.stringify(authenticatedUser)
    );
  },
};

export default {
  state: data,
  getters,
  actions,
  mutations,
};
