// eslint-ignore-file
// eslint-disable-next-line import/no-cycle
import BaseService from '@/services/Base';
import { ActionContext } from 'vuex';

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
    const authService = new BaseService('/login');
    const res = await authService.post(payload);
    await commit('setToken', res.data);
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
    const userService = new BaseService('/me');
    const resUser = await userService.get('');
    commit('setAuthenticatedUser', resUser.data);
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
