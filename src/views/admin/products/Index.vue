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
          @click="openCreateForm(null, 'create')">
          <v-icon small>mdi-card-plus-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="d-flex ml-8" justify="start">
      <v-card
        class="mr-4 mb-4"
        max-width="200"
        v-for="(item, index) in items"
        :key="index"
        outlined
      >
        <div>
          <v-img
            height="200"
            src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
          ></v-img>
          <v-btn color="white" large absolute top right icon @click="openCreateForm(item, 'edit')">
              <v-icon>mdi-tune-vertical</v-icon>
          </v-btn>
        </div>
        <v-card-title> {{ item.name }}</v-card-title>

        <v-card-text>
          <div>{{ item.description }}</div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-row justify="center">
          <v-card-actions>
            <v-btn class="my-4" fab rounded small @click="changeQuantity(item, false)"
              ><v-icon> mdi-minus</v-icon>
            </v-btn>
            <v-btn class="my-4" fab dark color="black" rounded
              >{{item.quantity}}
            </v-btn>
            <v-btn class="my-4" fab rounded small @click="changeQuantity(item, true)"
              ><v-icon> mdi-plus</v-icon>
            </v-btn>
          </v-card-actions>
        </v-row>
      </v-card>
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
import CreateDialog from '@/views/admin/products/Dialog.vue';

export default Vue.extend({
  name: 'ProductsIndex',
  components: {
    CreateDialog
  },
  data: () => ({
    // Data General,
    items: [] as any[],
    service : new BaseService('/products'),
    createFields: {
      name: {
        label: 'Nama Produk',
        type: 'string',
        value: '',
        rules: [(v) => !!v || 'Nama Produk is required'],
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
      imageurl: {
        label: 'Image',
        type: 'string',
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
      const res = await this.service.get(params);
      this.items = res.data;
      this.$forceUpdate();
    },

    async changeQuantity(item,isPlus) {
      try {
        const payload ={
          name:item.name,
          code: item.code,
          description:item.description,
          price: item.price,
          quantity: isPlus? item.quantity + 1 : item.quantity -1,
          imageurl:''
        }
        await this.service.put(item.id, payload);
        this.refresh();
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
    openCreateForm(item, type) {
      const { createMainDialog }: any = this.$refs;
      createMainDialog.startForm(item, type);
    },
  },
});
</script>
