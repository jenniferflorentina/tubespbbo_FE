<template>
  <v-breadcrumbs class="container">
    <v-row class="d-flex flex-column ml-8 w-100">
      <v-col cols="12">
        <h1>Products</h1>
      </v-col>
      <v-col cols="12">
        <v-btn
          style="float: right"
          color="primary"
          @click="openCreateForm(null, 'create')"
        >
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

export default Vue.extend({
  name: 'ProductsIndex',
  data: () => ({
    // Data General,
    items: [] as any[],
    createFields: {
      name: {
        label: 'Nama Produk',
        type: 'string',
        value: '',
        rules: [(v) => !!v || 'Title is required'],
      },
      code: {
        label: 'Code Produk',
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
      price: {
        label: 'Price',
        type: 'number',
        value: '',
        rules: [],
      },
      description: {
        label: 'Description',
        type: 'string',
        value: '',
        rules: [],
      },
      image: {
        label: 'Image',
        type: 'string',
        value: '',
        rules: [],
      },
    },
  }),
});
</script>
