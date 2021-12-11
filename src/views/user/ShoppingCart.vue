<template>
  <v-dialog
    v-model="isOpen"
    max-width="70rem"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="pb-4">
      <v-toolbar class="px-4">
        <v-toolbar-title>Shopping Cart</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="isOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mb-4 mt-8">
        <v-form class="px-4" ref="form" @submit.prevent="save()">
          <v-row align="center" justify="center">
            <v-col cols="12" lg="12">
              <v-card
                class="mb-4"
                v-for="(item, index) in items"
                :key="index"
                elevation="2"
              >
                <v-row class="pb-0">
                  <v-col class="ml-3" cols="3">
                    <v-img
                      height="120"
                      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
                    ></v-img>
                  </v-col>
                  <v-col cols="5">
                    <v-card-title> {{ item.product.name }}</v-card-title>
                    <v-card-subtitle>
                      {{ item.product.description }}</v-card-subtitle
                    >
                    <v-card-title>
                      {{ formatCurrency(item.product.price) }}</v-card-title
                    >
                  </v-col>
                  <v-col cols="3">
                    <v-card-actions>
                      <v-btn
                        v-if="item.quantity > 1"
                        class="my-4"
                        fab
                        icon
                        rounded
                        small
                        @click="changeQuantity(item, false)"
                        ><v-icon> mdi-minus</v-icon>
                      </v-btn>
                      <v-btn class="my-4" fab dark color="black" rounded
                        >{{ item.quantity }}
                      </v-btn>
                      <v-btn
                        class="my-4"
                        fab
                        rounded
                        small
                        icon
                        @click="changeQuantity(item, true)"
                        ><v-icon> mdi-plus</v-icon>
                      </v-btn>
                      <v-btn
                        fab
                        rounded
                        icon
                        color="error"
                        @click="promptDeleteItem(item.id)"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </v-card-actions>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn outlined large @click="save()" v-if="items.length > 0"
          >Bayar</v-btn
        >
      </v-card-actions>
    </v-card>
    <DeleteDialog ref="deleteMainDialog" />
    <PaymentDialog ref="paymentDetail" :formatCurrency="formatCurrency" />
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import BaseService from '@/services/Base';
import DeleteDialog from '@/views/user/DeleteDialog.vue';
import PaymentDialog from '@/views/user/Payment.vue';

export default Vue.extend({
  name: 'ShoppingCart',
  components: { DeleteDialog, PaymentDialog },
  props: ['refresh', 'formatCurrency', 'items'],
  data: () => ({
    isOpen: false,
    type: 'create',
    productId: 0,
    product: [] as any[],
    transaksiId: '',
  }),

  async created() {
    this.setLoading(true);
    this.setLoading(false);
  },
  computed: {
    ...mapGetters(['authenticatedUser']),
  },
  methods: {
    ...mapActions(['setLoading', 'setSnackbar']),
    startForm(mode) {
      this.isOpen = true;
      this.type = mode;
    },

    async changeQuantity(item, isPlus) {
      try {
        const service = new BaseService(`/shopping-cart/${item.id}`);
        const payload = {
          quantity: isPlus ? item.quantity + 1 : item.quantity - 1,
        };
        await service.putPayload(payload);
        await this.refresh();
        this.$forceUpdate();
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
    promptDeleteItem(id) {
      this.productId = id;
      const dialog: any = this.$refs.deleteMainDialog;
      dialog.toggleShowModal(this.deleteItem);
    },

    async deleteItem() {
      try {
        this.setLoading(true);
        const toDelete = this.productId;
        const service = new BaseService('/shopping-cart');
        if (toDelete) await service.delete(toDelete);
        await this.refresh();
        this.setLoading(false);
      } catch (e) {
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'error',
        });
        this.setLoading(false);
      }
    },

    openPaymentDetail(id) {
      const { paymentDetail }: any = this.$refs;
      const type = 'create';
      paymentDetail.startForm(type, id);
    },

    async setupPayload() {
      const details = [] as any;
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < this.items.length; index++) {
        details.push(this.payloadProduct(this.items[index]));
      }
      const payload = {
        userId: this.authenticatedUser.id,
        details,
      };
      return payload;
    },

    payloadProduct(item) {
      const payload = {
        productId: item.productId,
        quantity: Number(item.quantity),
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
        if (this.type === 'create') {
          const res = await service.post(payload);
          this.transaksiId = res.data.Id;
        }
        this.refresh();
        this.isOpen = false;
        this.openPaymentDetail(this.transaksiId);
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
  },
});
</script>
