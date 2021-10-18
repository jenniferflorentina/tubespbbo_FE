import NProgress from 'nprogress';

type SnackbarType = {
  isVisible: boolean;
  message: string;
  color: string;
}

interface GlobalModule {
  snackbar: SnackbarType;
}

const data = (): GlobalModule => ({
  snackbar: {
    isVisible: false,
    message: '',
    color: '',
  },
});

const getters = {
  snackbar: (state: GlobalModule) => state.snackbar,
};

const actions = {
  setLoading: (ctx, status: boolean) => {
    if (status) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  },
  setSnackbar: ({ commit }, snackbar: SnackbarType) => {
    commit('setSnackbar', snackbar);
  },
}

const mutations = {
  setSnackbar: (state: GlobalModule, snackbar: SnackbarType) => {
    state.snackbar = snackbar;
  },
};

export default {
  state: data, getters, actions, mutations,
};
