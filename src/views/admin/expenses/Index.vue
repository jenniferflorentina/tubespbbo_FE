<template>
  <v-breadcrumbs class="container">
    <header-component />
    
    <v-row class="d-flex flex-column ml-8 w-90" >
      <v-col cols="12">
        <h1>Expenses</h1>
      </v-col>
      <v-col cols="12" v-for="(item, index) in items" :key="index">
        <v-card class="my-2 py-2 w-100" outlined>
          <v-card-text>
            <v-row>
            <v-col cols="4" class="text-h6">
              {{ item.description }}
            </v-col>
            <v-col cols="2" class="text-h6">
              {{ item.quantity }}
            </v-col>
            <v-col cols="3" class="text-h6">
              {{ formatCurrency(item.totalAmount) }}
            </v-col>
            <v-col cols="3" align-content-center justify="end">
              <v-row>
                <v-col cols="6" justify="end">
                  <v-btn outlined> Edit </v-btn>
                </v-col>
                <v-col cols="6" justify="end">
                  <v-btn outlined> Detail </v-btn>
                </v-col>
              </v-row>
            </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-breadcrumbs>
</template>

<script lang="ts">
import Vue from 'vue';
import HeaderComponent from '@/components/layouts/header/HeaderAdmin.vue';
import { mapActions } from 'vuex';
import BaseService from '@/services/Base';

export default Vue.extend({
  name: 'ExpensesIndex',
  components: {
    HeaderComponent,
  },
  data: () => ({
    // Data General,
    items: [] as any[],
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
      const service = new BaseService('/expenses');
      const res = await service.get(params);
      this.items = res.data;
      this.$forceUpdate();
    },

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
