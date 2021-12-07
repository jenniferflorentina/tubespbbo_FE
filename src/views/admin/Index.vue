<template>
  <v-breadcrumbs class="container">
    <v-row class="d-flex flex-column ml-8 w-100">
      <v-col col="12">
        <v-card color="#385F73" dark class="pa-2 rounded-xl">
          <v-card-title class="text-h1">
            Hello {{ authenticatedUser.name }}!
          </v-card-title>

          <v-card-subtitle class="text-h4"
            >Welcome to Calleryna ~~
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col col="12" style="min-height: calc(100vh - 12rem)">
        <v-card elevation="2" outlined shaped>
          <v-card-title class="text-h2"> Pesanan </v-card-title>
          <div>
            <v-tabs v-model="tab" background-color="white" @change="refresh">
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
                {{ formatDate(item.createdAt) }}
              </v-col>
              <v-col cols="2" align-self="center" class="float:right;">
                <v-btn outlined @click="openDetailForm(item, 'detail')">
                  Detail
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
    <DetailDialog
      ref="openTransactionDialog"
      :refresh="refresh"
      :formatDate="formatDate"
    />
  </v-breadcrumbs>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import DetailDialog from '@/views/admin/DetailTransactionDialog.vue';
import BaseService from '@/services/Base';

export default Vue.extend({
  name: 'IndexAdmin',
  components: {
    DetailDialog,
  },

  data: () => ({
    // Data General,
    items: [] as any[],
    tabItems: ['Selesai', 'Proses', 'Belum Proses', 'Belum Terverifikasi'],
    tab: 0,
    service: new BaseService(),
    user: [] as any[],
  }),

  async created() {
    this.setLoading(true);
    await this.refresh();
    this.setLoading(false);
  },
  computed: {
    ...mapGetters(['authenticatedUser']),
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
      switch (this.tab) {
        case 1:
          this.items = res.data.filter((item) => item.status === 'Proses');
          break;
        case 2:
          this.items = res.data.filter(
            (item) => item.status === 'Belum Proses'
          );
          break;
        case 3:
          this.items = res.data.filter(
            (item) => item.status === 'Belum Terverifikasi'
          );
          break;
        default:
          this.items = res.data.filter((item) => item.status === 'Selesai');
          break;
      }
      this.$forceUpdate();
    },

    openDetailForm(item, type) {
      const { openTransactionDialog }: any = this.$refs;
      openTransactionDialog.startForm(item, type);
    },

    formatDate(date) {
      return moment(date).format('DD-MM-YYYY');
    },
  },
});
</script>
