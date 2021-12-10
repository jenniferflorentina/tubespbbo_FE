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
            <v-col cols="6">
              <v-card
                class="pb-0"
                v-for="(item, index) in items.transactionDetails"
                :key="index"
              >
                <v-card-title>{{ item.product.name }}</v-card-title>
                <v-row>
                  <v-col cols="4">
                    <v-card-text>{{
                      formatCurrency(item.product.price)
                    }}</v-card-text>
                  </v-col>
                  <v-col cols="3">
                    <v-card-text>x {{ item.quantity }}</v-card-text>
                  </v-col>
                  <v-col cols="5">
                    <v-card-text
                      >= {{ formatCurrency(subTotal(item)) }}</v-card-text
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="6" justify="start">
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
              <v-row class="pb-0">
                <v-text-field
                  v-model="createFields.accountNumber.value"
                  :items="createFields.accountNumber.items"
                  :label="createFields.accountNumber.label"
                  :rules="createFields.accountNumber.rules"
                  prepend-icon="mdi-card-account-details"
                  clearable
                >
                </v-text-field>
              </v-row>
              <v-row justify="end">
                <v-card-title
                  >Total Bayar : {{ formatCurrency(amount) }}</v-card-title
                >
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn outlined large @click="save()">Bayar</v-btn>
      </v-card-actions>
    </v-card>
    <PopUp ref="PopUp" />
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import BaseService from '@/services/Base';
import PopUp from '@/views/user/PaymentSuccessDialog.vue';

export default Vue.extend({
  name: 'PaymentDialog',
  props: ['formatCurrency'],
  components: { PopUp },
  data: () => ({
    isOpen: false,
    type: 'create',
    id: '',
    items: {} as any,
    service: new BaseService(),
    amount: 0,
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
      accountNumber: {
        label: 'Account Number',
        type: 'string',
        value: '',
        rules: [],
      },
    },
  }),

  async created() {
    this.setLoading(true);
    await this.fetchDataPayment();
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
      this.fetchTransactions();
    },

    async fetchDataPayment() {
      const service = new BaseService('/payment-methods');
      const res = await service.get('');
      this.createFields.payments.items = res.data;
      this.createFields.address.value = this.authenticatedUser.address;
      this.$forceUpdate();
    },

    async fetchTransactions() {
      const service = new BaseService('/transactions');
      const res = await service.getOne(this.id);
      this.items = res.data;
      this.totalAmount();
      this.$forceUpdate();
    },

    subTotal(item) {
      let result = 0;
      result = item.product.price * item.quantity;
      return result;
    },

    totalAmount() {
      for (
        let index = 0;
        index < this.items.transactionDetails.length;
        index += 1
      ) {
        const element = this.items.transactionDetails[index];
        this.amount += element.product.price * element.quantity;
      }
    },

    async setupPayload() {
      const payload = {
        paymentMethodId: this.createFields.payments.value,
        transactionId: this.id,
        accountNumber: this.createFields.accountNumber.value,
        amount: this.amount,
      };
      return payload;
    },

    async save() {
      try {
        if (!this.validate()) return;
        this.setLoading(true);
        const service = new BaseService('/payments');
        // Prepare payload
        const payload = await this.setupPayload();
        await service.post(payload);
        this.isOpen = false;
        this.openPopUp();
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

    openPopUp() {
      const { PopUp }: any = this.$refs;
      PopUp.startComment();
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
