<template>
  <v-dialog
    v-model="isOpen"
    max-width="70rem"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="pb-4">
      <v-toolbar class="px-4">
        <v-toolbar-title> Transaction</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          class="mx-2"
          small
          v-if="type === 'detail'"
          @click="type = 'edit'"
        >
          <v-icon small color="black">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="isOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mb-4 mt-6">
        <v-form class="px-4" ref="form" @submit.prevent="save()">
          <v-row align="center" justify="center">
            <v-col class="pt-4 pb-0" cols="12" lg="12">
              <v-text-field
                v-model="createFields.nama.value"
                :label="createFields.nama.label"
                outlined
                disabled
              ></v-text-field>
            </v-col>
            <v-col class="pt-4 pb-0" cols="12" lg="12">
              <v-text-field
                v-model="createFields.address.value"
                :label="createFields.address.label"
                outlined
                disabled
              ></v-text-field>
            </v-col>
            <v-col class="pt-4 pb-0" cols="12" lg="12">
              <v-select
                v-model="createFields.status.value"
                :items="createFields.status.items"
                :label="createFields.status.label"
                :rules="createFields.status.rules"
                :disabled="isFormDisabled"
                outlined
              />
            </v-col>
            <v-col class="pt-4 pb-0" cols="12" lg="12">
              <v-text-field
                v-model="createFields.receiptNumber.value"
                :label="createFields.receiptNumber.label"
                :rules="createFields.receiptNumber.rules"
                :disabled="isFormDisabled"
                outlined
              ></v-text-field>
            </v-col>
            <v-col class="pt-4 pb-0" cols="12" lg="12">
              <v-text-field
                v-model="createFields.createdAt.value"
                :label="createFields.createdAt.label"
                disabled
                outlined
              ></v-text-field>
            </v-col>
            <v-col class="pb-0" cols="12" lg="12">
              <v-text-field
                v-model="createFields.paymentStatus.value"
                :label="createFields.paymentStatus.label"
                disabled
                outlined
              />
            </v-col>
            <v-col class="pb-0" cols="12">
              <v-text-field
                v-model="createFields.amount.value"
                :label="createFields.amount.label"
                disabled
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-for="(item, index) in transactionDetails" :key="index">
            <v-col cols="12"><h3>Details Produk</h3></v-col>
            <v-col class="pb-0" cols="4">
              <v-text-field
                :value="item.product.name"
                label="Nama Produk"
                disabled
                outlined
              ></v-text-field>
            </v-col>
            <v-col class="pb-0" cols="4">
              <v-text-field
                :value="item.product.price"
                label="Price"
                disabled
                outlined
              ></v-text-field>
            </v-col>
            <v-col class="pb-0" cols="4">
              <v-text-field
                v-model="item.quantity"
                :label="createFields.quantity.label"
                disabled
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn v-if="type !== 'detail'" color="primary" @click="save()"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import moment from 'moment';
import BaseService from '@/services/Base';

export default Vue.extend({
  name: 'CreateDialog',
  props: ['refresh', 'createFields'],
  data: () => ({
    isOpen: false,
    transactionId: '',
    transactionDetails: [] as any,
    type: '',
  }),

  computed: {
    isFormDisabled(): boolean {
      return this.type === 'detail';
    },
  },

  async created() {
    this.setLoading(true);
    this.setLoading(false);
  },

  methods: {
    ...mapActions(['setLoading', 'setSnackbar']),

    async startForm(item, type: string) {
      this.isOpen = true;
      this.type = type;
      if (type !== 'create') {
        this.fillForm(item);
        this.transactionId = item.id;
      }
    },

    fillForm(item: any) {
      if (!item) return;
      const {
        status,
        receiptNumber,
        user,
        createdAt,
        payment,
        transactionDetails,
      } = item;
      const dataObj = {
        status,
        receiptNumber,
        nama: user.name,
        address: user.address,
        createdAt,
        amount: payment.amount,
        paymentStatus: payment.status,
        transactionDetails,
      };

      const keys = Object.keys(dataObj);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        switch (key) {
          case 'transactionDetails':
            this.transactionDetails = dataObj[key];
            break;
          case 'createdAt':
            this.createFields[key].value = this.formatDate(dataObj[key]);
            break;
          case 'amount':
            this.createFields[key].value = this.formatCurrency(dataObj[key]);
            break;
          default:
            this.createFields[key].value = dataObj[key];
        }
      }
    },

    async setupPayload() {
      const payload = {
        status: this.createFields.status.value,
        receiptNumber: this.createFields.receiptNumber.value,
      };
      return payload;
    },

    async save() {
      try {
        if (!this.validate()) return;
        this.setLoading(true);
        const service = new BaseService('/transactions');
        // Prepare payload
        const payload = await this.setupPayload();
        await service.put(this.transactionId, payload);

        this.refresh();
        this.isOpen = false;
        this.setLoading(false);
        (this.$refs.form as Vue & { reset: () => void }).reset();
      } catch (e) {
        this.isOpen = false;
        this.setLoading(false);
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'error',
        });
      }
    },

    formatCurrency(value) {
      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumSignificantDigits: 1,
      });
      return formatter.format(value);
    },

    validate() {
      return (
        this.$refs.form as Vue & {
          validate: () => boolean;
        }
      ).validate();
    },

    formatDate(date) {
      return moment(date).format('DD-MM-YYYY');
    },
  },
});
</script>
