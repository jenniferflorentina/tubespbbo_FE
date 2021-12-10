<template>
  <v-breadcrumbs class="container">
    <v-row class="d-flex flex-column ml-8 w-100">
      <v-col cols="12">
        <h1>Transactions</h1>
      </v-col>
      <v-col cols="12">
        <v-tabs v-model="tab" background-color="white" @change="refresh">
          <v-tab v-for="tabItem in tabItems" :key="tabItem">
            {{ tabItem }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="12" v-for="(item, index) in items" :key="index">
        <v-card class="my-2 py-2 w-100" outlined>
          <v-card-text>
            <v-row>
              <v-col cols="1" align-self="center" class="ml-2">
                <v-avatar size="40">
                  <img
                    alt="Joan"
                    src="https://randomuser.me/api/portraits/women/55.jpg"
                  />
                </v-avatar>
              </v-col>
              <v-col cols="2" align-self="center" class="text-h6">
                {{ item.userId }}
              </v-col>
              <v-col cols="3.5" align-self="center" class="text-h6">
                <v-icon>mdi-calendar</v-icon>
                {{ formatDate(item.createdAt) }}
              </v-col>
              <v-col cols="2.5" align-self="center" class="text-h6">
                {{ item.receiptNumber }}
              </v-col>
              <v-col cols="3" align-content-center justify="end">
                <v-row>
                  <v-col cols="6" justify="end">
                    <v-btn outlined @click="openCreateForm(item, 'edit')">
                      Edit
                    </v-btn>
                  </v-col>
                  <v-col cols="6" justify="end">
                    <v-btn outlined @click="openCreateForm(item, 'detail')">
                      Detail
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <CreateDialog
      ref="createMainDialog"
      :createFields="createFields"
      :refresh="refresh"
    />
  </v-breadcrumbs>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import moment from 'moment';
import BaseService from '@/services/Base';
import CreateDialog from '@/views/admin/transactions/Dialog.vue';

export default Vue.extend({
  name: 'TransactionIndex',
  components: {
    CreateDialog,
  },
  data: () => ({
    // Data General,
    transactionDetails: '',
    items: [] as any[],
    service: new BaseService('/products'),
    tabItems: ['Belum Proses', 'Dikemas', 'Dikirim', 'Selesai'],
    tab: 0,
    createFields: {
      createdAt: {
        label: 'Transaction Date',
        type: 'string',
        value: '',
        rules: [],
      },
      receiptNumber: {
        label: 'Receipt Number',
        type: 'string',
        value: '',
        rules: [],
      },
      status: {
        label: 'Status Pesanan',
        type: 'select',
        items: ['Belum Proses', 'Dikemas', 'Dikirim', 'Selesai'],
        value: '',
        rules: [],
      },
      nama: {
        label: 'Nama',
        type: 'string',
        value: '',
        rules: [],
      },
      address: {
        label: 'Address',
        type: 'string',
        value: '',
        rules: [],
      },
      amount: {
        label: 'Amount',
        type: 'number',
        value: '',
        rules: [],
      },
      paymentStatus: {
        label: 'Payment Status',
        type: 'string',
        value: '',
        rules: [],
      },
      quantity: {
        label: 'Quantity',
        type: 'number',
        value: '',
        rules: [],
      },
    },
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
      switch (this.tab) {
        case 1:
          this.items = res.data.filter((item) => item.status === 'Dikemas');
          break;
        case 2:
          this.items = res.data.filter((item) => item.status === 'Dikirim');
          break;
        case 3:
          this.items = res.data.filter((item) => item.status === 'Selesai');
          break;
        default:
          this.items = res.data.filter(
            (item) => item.status === 'Belum Proses'
          );
          break;
      }
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

    openCreateForm(item, type) {
      const { createMainDialog }: any = this.$refs;
      createMainDialog.startForm(item, type);
    },

    formatDate(date) {
      return moment(date).format('DD-MM-YYYY HH:mm');
    },
  },
});
</script>
<style lang="scss" scoped>
.v-list-item__title {
  color: black;
}
</style>
