<template>
  <v-breadcrumbs class="container">    
    <v-row class="d-flex flex-column ml-8 w-100" >
      <v-col cols="12">
        <h1>Expenses</h1>
      </v-col>
      <v-col cols="12">
        <v-btn
          style="float:right;"
          color="primary"
          @click="openCreateForm(null, 'create')">
            <v-icon small>mdi-card-plus-outline</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" v-for="(item, index) in items" :key="index">
        <v-card class="my-2 py-2 w-100" outlined>
          <v-card-text>
            <v-row>
            <v-col cols="4" class="text-h6">
              {{ item.name }}
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
                  <v-btn outlined @click="openCreateForm(item, 'edit')"> Edit </v-btn>
                </v-col>
                <v-col cols="6" justify="end">
                  <v-btn outlined @click="openCreateForm(item, 'detail')"> Detail </v-btn>
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
import BaseService from '@/services/Base';
import CreateDialog from '@/views/admin/expenses/Dialog.vue';

export default Vue.extend({
  name: 'ExpensesIndex',
  components: {
    CreateDialog
  },
  data: () => ({
    // Data General,
    items: [] as any[],
    createFields: {
      name: {
        label: 'Nama Pengeluaran',
        type: 'string',
        value: '',
        rules: [
          (v) => !!v || "Title is required",
        ],
      },
      releaseDate: {
        label: 'Release Date',
        type: 'date',
        value: '',
        formatted: '',
        showModal: false,
        rules: [
          (v) => !!v || "Release Date is required",
        ],
      },
      category: {
        label: 'Category',
        type: 'select',
        items: [{text:"Purchase stock", value:0},{text:"Nurturing expense", value:1}],
        value: '',
        rules: [],
      },
      user: {
        label: 'User',
        type: 'autocomplete',
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
      totalAmount: {
        label: 'Total Amount',
        type: 'number',
        value: '',
        rules: [],
      },
      description: {
        label: 'Description',
        type: 'string',
        value: '',
        rules: [],
      }
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

    openCreateForm(item, type) {
      const { createMainDialog }: any = this.$refs;
      createMainDialog.startForm(item, type);
    },
  },
});
</script>
<style lang="scss" scoped>
.v-list-item__title{
  color:black;
}
</style>