<template>
  <div>
    <v-btn style="float: right" class="mr-3" @click="openShoppingCart()">
      <v-icon>mdi-cart</v-icon>
    </v-btn>
    <v-container fill-height>
      <v-card
        class="mx-auto my-4"
        max-width="374"
        v-for="(item, index) in items"
        :key="index"
      >
        <v-img
          v-if="item.ImageUrl !== ''"
          height="250"
          :src="item.ImageUrl"
          @error="item.ImageUrl = 'https://cdn.vuetifyjs.com/images/cards/cooking.png'"
        ></v-img>
        <v-img
          v-else
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
            <v-btn
              class="my-4 mr-5"
              fab
              dark
              color="black"
              rounded
              @click="addToCart(item)"
              ><v-icon> mdi-cart</v-icon>
            </v-btn>
          </v-card-actions>
        </v-row>
      </v-card>
    </v-container>
    <ShoppingCart
      ref="shoppingCart"
      :refresh="refresh"
      :formatCurrency="formatCurrency"
      :items="shoppingCart"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import BaseService from '@/services/Base';
import ShoppingCart from '@/views/user/ShoppingCart.vue';

export default Vue.extend({
  components: { ShoppingCart },
  name: 'Index',
  data: () => ({
    // Data General,
    items: [] as any[],
    mode: 'create',
    service: new BaseService(),
    shoppingCart: [] as any[],
  }),

  async created() {
    this.setLoading(true);
    await this.refresh();
    this.setLoading(false);
  },
  computed: {
    ...mapGetters(['authenticatedUser']),
  },
  methods: {
    ...mapActions(['setLoading', 'setSnackbar']),
    openShoppingCart() {
      const { shoppingCart }: any = this.$refs;
      const mode = 'create';
      shoppingCart.startForm(mode);
    },

    async addToCart(item) {
      try {
        this.setLoading(true);
        this.service = new BaseService('/shopping-cart');
        const payload = {
          userId: this.authenticatedUser.id,
          productId: item.id,
          quantity: 1,
        };
        await this.service.post(payload);
        this.refresh();
        this.$forceUpdate();
        this.setLoading(false);
      } catch (e) {
        this.setLoading(false);
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'danger',
        });
      }
    },

    async getShoppingCart() {
      const endpoint = this.authenticatedUser.id;
      const service = new BaseService(`/users/${endpoint}/shopping-cart`);
      const res = await service.get('');
      this.shoppingCart = res.data;
      this.$forceUpdate();
    },

    async refresh() {
      try {
        await this.request('');
        await this.getShoppingCart();
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
