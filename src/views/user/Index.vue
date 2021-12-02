<template>
  <div>
    <v-container fill-height>
      <v-card
        class="mx-auto"
        max-width="374"
        v-for="(item, index) in items"
        :key="index"
      >
        <v-img
          height="250"
          src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
        ></v-img>

        <v-card-title> {{ item.name }}</v-card-title>

        <v-card-text>
          <div>{{ item.description }}</div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-row justify="end">
          <v-card-title>{{ formatCurrency(item.price) }}</v-card-title>
          <v-card-actions>
            <v-btn class="my-4 mr-5" fab dark color="black" rounded
              ><v-icon> mdi-cart</v-icon>
            </v-btn>
          </v-card-actions>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import BaseService from '@/services/Base';

export default Vue.extend({
  name: 'Index',
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
      const service = new BaseService('/products');
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
