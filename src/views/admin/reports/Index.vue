<template>
  <v-breadcrumbs class="container">
    <v-row class="d-flex flex-column ml-8 w-100">
      <v-col cols="12">
        <h1>Reports</h1>
      </v-col>
      <v-col cols="12">
        
      </v-col>
    </v-row>
    <v-row class="d-flex ml-8 w-100" justify="start">
      <v-card width="100vw">
        <v-data-table
          :headers="headers"
          :items="items"
          hide-default-footer
          class="elevation-1"
        >
          <template
            v-for="(header, i) in headers"
            v-slot:[`item.${header.value}`]="{ item }"
          >
            <div :key="i">
              <div>
                {{ setItemTable(item, header.value) }}
              </div>
            </div>
          </template>
          <template slot="body.append">
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Total</td>
              <td>{{ formatCurrency(totalDebit) }}</td>
              <td>{{ formatCurrency(totalCredit) }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <v-card color="#385F73" dark class="pa-2 mt-8 rounded-xl">
        <v-card-title class="text-h1"> Saldo Akhir </v-card-title>

        <v-card-subtitle class="text-h2"
          >{{formatCurrency(totalDebit-totalCredit)}}
        </v-card-subtitle>
      </v-card>
    </v-row>
  </v-breadcrumbs>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import BaseService from '@/services/Base';
import moment from 'moment';

export default Vue.extend({
  name: 'ReportsIndex',
  data: () => ({
    // Data General,
    items: [] as any[],
    service : new BaseService('/reports'),
    month : new Date().getUTCMonth()+1,
    year : new Date().getUTCFullYear(),
    totalDebit: 0,
    totalCredit: 0,
    headers: [
      {
        text: 'Created',
        align: 'left',
        value: 'created',
      },
      {
        text: 'Tanggal',
        align: 'left',
        value: 'date',
      },
      {
        text: 'Id',
        align: 'left',
        value: 'id',
      },
      {
        text: 'Keterangan',
        align: 'left',
        value: 'keterangan',
      },
      {
        text: 'Debit',
        align: 'left',
        value: 'debit',
      },
      {
        text: 'Credit',
        align: 'left',
        value: 'credit',
      },
    ]
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
        await this.request(`year=${this.year}&month=${this.month}`);
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
      const res = await this.service.get(params);
      this.items = res.data;
      let debitTemp = 0;
      let creditTemp = 0;
      for (let i = 0; i < this.items.length; i += 1) {
        if(this.items[i].type === 'Debit'){
          debitTemp += this.items[i].amount;
        }else{
          creditTemp += this.items[i].amount;
        }
      }
      this.totalDebit = debitTemp;
      this.totalCredit = creditTemp;
      this.$forceUpdate();
    },

    setItemTable(item: any, headerValue) {
      switch (headerValue) {
        case 'created':
          return moment(item.createdAt).format('DD-MM-YYYY HH:mm');
        case 'date':
          return moment(item.date).format('DD-MM-YYYY');
        case 'keterangan':
          return item.type === 'Debit' ? 'Transaksi' : 'Expense';
        case 'debit':
          return item.type === 'Debit' ? this.formatCurrency(item.amount) : '-';
        case 'credit':
          return item.type === 'Credit' ? this.formatCurrency(item.amount) : '-';
        default:
          return item[headerValue];
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
  },
});
</script>
