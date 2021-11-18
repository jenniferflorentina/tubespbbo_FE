<template>
  <div>
    <v-breadcrumbs class="container">
      <header-component />
      <v-row class="d-flex" style="min-height: calc(100vh - 2rem)">
        <v-col col="12" sm="8">
          <v-card color="#385F73" dark class="ml-3 pa-2 rounded-xl">
            <v-card-title class="text-h1"> Hello Josh! </v-card-title>

            <v-card-subtitle class="text-h4"
              >Welcome to Calleryna ~~
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col col="12" sm="8" style="min-height: calc(100vh - 12rem)">
          <v-card class="ml-3" elevation="2" outlined shaped>
            <v-card-title class="text-h2"> Pesanan </v-card-title>
            <div>
              <v-tabs
                v-model="tab"
                background-color="white"
                @change="filteredItems"
              >
                <v-tab v-for="tabItem in tabItems" :key="tabItem">
                  {{ tabItem }}
                </v-tab>
              </v-tabs>
            </div>
            <v-card v-for="(item, index) in items" :key="index">
              <v-row no-gutters>
                <v-col cols="1" align-self="center" class="ml-2">
                  <v-avatar size="40">
                    <img
                      alt="Joan"
                      src="https://randomuser.me/api/portraits/women/55.jpg"
                    />
                  </v-avatar>
                </v-col>
                <v-col cols="2">
                  <v-card-text>
                    {{ item.userId }}
                  </v-card-text>
                </v-col>
                <v-col align-self="center">
                  <v-icon>mdi-calendar</v-icon>
                  {{ item.transactionDate }}
                </v-col>
                <v-col cols="2" justify="end">
                  <v-btn outlined> Detail </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-breadcrumbs>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import HeaderComponent from '@/components/layouts/header/HeaderAdmin.vue';
import BaseService from '@/services/Base';

export default Vue.extend({
  name: 'IndexAdmin',
  components: {
    HeaderComponent,
  },

  data: () => ({
    // Data General,
    items: [] as any[],
    tabItems: ['Selesai', 'Proses', 'Belum Proses'],
    tab: 0,
    service: new BaseService(),
    user: [] as any[],
  }),

  async created() {
    this.setLoading(true);
    await this.refresh();
    this.setLoading(false);
  },

  methods: {
    ...mapActions(['setLoading', 'setSnackbar']),
    async refresh() {
      try {
        await this.request('');
      } catch (e) {
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'error',
        });
      } finally {
        this.setLoading(false);
      }
    },
    async request(params) {
      this.setLoading(true);
      const service = new BaseService('/transactions');
      const res = await service.get(params);
      this.items = res.data;
      this.$forceUpdate();
    },

    // filteredItems() {
    //   const tabObj = {
    //     0: 'search=status.status:"Selesai"',
    //     1: 'search=status.status:"Proses"',
    //     2: 'search=status.status:"Belum Proses"',
    //   };

    //   this.request(tabObj[this.tab]);
    // },

    formatCurrency(value) {
      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumSignificantDigits: 1,
      });
      return formatter.format(value);
    },
  },
});
</script>
