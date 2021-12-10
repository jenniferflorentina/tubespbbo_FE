<template>
  <v-dialog
    v-model="isOpen"
    max-width="70rem"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="pb-4">
      <v-toolbar class="px-4">
        <v-toolbar-title>Pembayaran</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="isOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mb-4 mt-8">
        <v-form class="px-4" ref="form" @submit.prevent="save()">
          <v-row class="mt-2" align="center" justify="center">
            <v-col cols="6" lg="12">
              <v-row
                class="pb-0"
                v-for="(item, index) in items.transactionDetails"
                :key="index"
              >
                <v-card-title>{{ item.product.name }}</v-card-title>
                <v-card-text>{{ item.product.price }}</v-card-text>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row class="pb-0">
                <v-text-field
                  v-model="createFields.address.value"
                  :label="createFields.address.label"
                  :rules="createFields.address.rules"
                  prepend-icon="mdi-map"
                  disabled
                />
              </v-row>
              <v-row class="pb-0">
                <v-select
                  v-model="createFields.category.value"
                  :items="createFields.category.items"
                  :label="createFields.category.label"
                  :rules="createFields.category.rules"
                  prepend-icon="mdi-cube-outline"
                />
              </v-row>
              <v-row class="pb-0">
                <v-select
                  v-model="createFields.payments.value"
                  :items="createFields.payments.items"
                  item-text="name"
                  item-value="id"
                  :label="createFields.payments.label"
                  :rules="createFields.payments.rules"
                  prepend-icon="mdi-wallet"
                  clearable
                />
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn outlined large>Bayar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import BaseService from '@/services/Base';

export default Vue.extend({
  name: 'PaymentDialog',
  props: ['formatCurrency'],
  data: () => ({
    isOpen: false,
    type: 'create',
    id: '',
    items: [] as any[],
    service: new BaseService(),
    createFields: {
      address: {
        label: 'Alamat Pengiriman',
        type: 'string',
        value: '',
        rules: [],
      },
      category: {
        label: 'Opsi Pengiriman',
        type: 'select',
        items: [
          { text: 'Si Cepat', value: 0 },
          { text: 'JNE', value: 1 },
          { text: 'J&T', value: 2 },
        ],
        value: '',
        rules: [],
      },
      payments: {
        label: 'Metode Pembayaran',
        type: 'select',
        items: [],
        value: '',
        rules: [],
      },
    },
  }),

  async created() {
    this.setLoading(true);
    this.fetchDataPayment();
    this.setLoading(false);
  },
  computed: {
    ...mapGetters(['authenticatedUser']),
  },
  methods: {
    ...mapActions(['setLoading', 'setSnackbar']),
    startForm(type, id) {
      this.isOpen = true;
      this.type = type;
      this.id = id;
    },

    async fetchDataPayment() {
      const service = new BaseService('/payment-methods');
      const res = await service.get('');
      this.createFields.payments.items = res.data;
      this.createFields.address.value = this.authenticatedUser.address;
      this.$forceUpdate();
    },

    validate() {
      return (
        this.$refs.form as Vue & {
          validate: () => boolean;
        }
      ).validate();
    },
  },
});
</script>
