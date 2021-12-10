<template>
  <v-dialog
    v-model="isOpen"
    max-width="70rem"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="pb-4">
      <v-toolbar class="px-4">
        <v-toolbar-title>Detail Pesanan</v-toolbar-title>
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
                v-model="createFields.createdAt.value"
                :label="createFields.createdAt.label"
                :rules="createFields.createdAt.rules"
                prepend-icon="mdi-calendar"
                disabled
                outlined
              />
            </v-col>
            <v-col class="pb-0" cols="12" lg="12">
              <v-select
                v-model="createFields.paymentMethod.value"
                :items="createFields.paymentMethod.items"
                item-text="name"
                item-value="id"
                :label="createFields.paymentMethod.label"
                :rules="createFields.paymentMethod.rules"
                prepend-icon="mdi-wallet"
                clearable
                :disabled="isFormDisabled"
                outlined
              />
            </v-col>
            <v-row>
              <v-card-title>Detail Product</v-card-title>
            </v-row>
            <v-row v-for="(item, index) in transactionDetails" :key="index">
              <v-col class="pb-0" cols="3">
                <v-text-field
                  v-model="item.product.name"
                  label="Nama Produk"
                  disabled
                  outlined
                ></v-text-field>
              </v-col>
              <v-col class="pb-0" cols="3">
                <v-text-field
                  v-model="item.product.price"
                  label="Price"
                  disabled
                  outlined
                ></v-text-field>
              </v-col>
              <v-col class="pb-0" cols="3">
                <v-text-field
                  v-model="item.quantity"
                  :label="createFields.quantity.label"
                  disabled
                  outlined
                ></v-text-field>
              </v-col>
              <v-col class="pb-0" cols="3">
                <v-card-title>{{
                  formatCurrency(subTotal(item))
                }}</v-card-title>
              </v-col>
            </v-row>
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
  props: ['refresh', 'formatDate', 'formatCurrency'],
  data: () => ({
    isOpen: false,
    id: '',
    type: '',
    transactionDetails: [] as any,
    createFields: {
      createdAt: {
        label: 'Transaction Date',
        type: 'string',
        value: '',
        formatted: '',
      },
      address: {
        label: 'Alamat Pengiriman',
        type: 'string',
        value: '',
        rules: [],
      },
      category: {
        label: 'Opsi Pengiriman',
        type: 'select',
        value: 'Si Cepat',
        rules: [],
      },
      paymentMethod: {
        label: 'Metode Pembayaran',
        type: 'select',
        items: [],
        value: '',
        rules: [],
      },
      quantity: {
        label: 'Quantity',
        type: 'number',
        value: '',
        rules: [],
      },
      SubTotal: {
        label: 'Sub Total',
        type: 'number',
        value: '',
        rules: [],
      },
    },
  }),

  computed: {
    isFormDisabled(): boolean {
      return this.type === 'detail';
    },
  },

  watch: {
    isOpen: {
      async handler() {
        if (this.isOpen === false) {
          (this.$refs.form as Vue & { reset: () => void }).reset();
        }
      },
    },
  },

  async created() {
    this.setLoading(true);
    this.fetchDataPayment();
    this.setLoading(false);
  },

  methods: {
    ...mapActions(['setLoading', 'setSnackbar']),

    async startForm(item, type: string) {
      this.isOpen = true;
      this.type = type;
      this.refresh();
      if (type !== 'create') {
        this.fillForm(item);
        this.id = item.id;
      }
    },

    fillForm(item: any) {
      if (!item) return;
      const { createdAt, transactionDetails, payment } = item;
      const dataObj = {
        createdAt,
        paymentMethod: payment.paymentMethodId,
        product: transactionDetails,
      };

      const keys = Object.keys(dataObj);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        switch (key) {
          case 'product':
            this.transactionDetails = dataObj.product;
            break;
          case 'createdAt':
            this.createFields[key].value = this.formatDate(dataObj[key]);
            break;
          default:
            this.createFields[key].value = dataObj[key];
        }
      }
    },

    async fetchDataPayment() {
      const service = new BaseService('/payment-methods');
      const res = await service.get('');
      this.createFields.paymentMethod.items = res.data;
      this.$forceUpdate();
    },

    subTotal(item) {
      let result = 0;
      result = item.product.price * item.quantity;
      return result;
    },

    onButtonClick(label) {
      (this.$refs[label] as Vue & { click: () => void }).click();
    },

    async setupPayload() {
      const payload = {
        paymentMethod: this.createFields.paymentMethod.value,
        transactionId: this.id,
        amount: Number(),
      };
      return payload;
    },

    async save() {
      try {
        if (!this.validate()) return;
        this.setLoading(true);
        const service = new BaseService('/expenses');
        // Prepare payload
        const payload = await this.setupPayload();
        if (this.type === 'create') {
          await service.post(payload);
        } else {
          await service.put(this.id, payload);
        }

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
    validate() {
      return (
        this.$refs.form as Vue & {
          validate: () => boolean;
        }
      ).validate();
    },

    formatDatePicker(field) {
      field.formatted = moment(field.value).format('DD-MM-YYYY');
      field.showModal = false;
    },
  },
});
</script>
