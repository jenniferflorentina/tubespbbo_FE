type HeaderType = {
  text: string;
  value: string;
  dataType?: string | null;
  show: boolean;
  filterValue?: string | null;
  align?: string | null;
  width?: string | null;
  sortable?: boolean | null;
};

interface GlobalModule {
  tableHeaders: HeaderType[];
}

const data = (): GlobalModule => ({
  tableHeaders: [],
});

const getters = {
  tableHeaders: (state: GlobalModule) => state.tableHeaders,
};

const actions = {
  setTableHeaders: ({ commit }, headers: HeaderType[]) => {
    const filteredHeader = headers.filter((header) => header.show);
    commit('setTableHeaders', filteredHeader);
  },
};

const mutations = {
  setTableHeaders: (state: GlobalModule, tableHeaders: HeaderType[]) => {
    state.tableHeaders = tableHeaders;
  },
};

export default {
  state: data,
  getters,
  actions,
  mutations,
};
