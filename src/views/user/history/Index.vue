<template>
  <v-breadcrumbs>
    <v-app-bar color="white" dense>
      <div>
        <v-tabs v-model="tab" background-color="white" @change="refresh">
          <v-tab v-for="tabItem in tabItems" :key="tabItem">
            {{ tabItem }}
          </v-tab>
        </v-tabs>
      </div>
      <v-spacer />
      <div clipped-right>
        <!--After Login-->
        <v-menu
          bottom
          left
          offset-y
          origin="top right"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <v-btn id="header-icon" v-on="on" class="mr-1" dark icon>
              <v-avatar size="40">
                <img
                  alt="Joan"
                  src="https://randomuser.me/api/portraits/women/55.jpg"
                />
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <!---User info -->
            <v-list-item>
              <v-list-item-avatar>
                <img
                  alt="Joan"
                  src="https://randomuser.me/api/portraits/women/55.jpg"
                />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{
                  authenticatedUser.name
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!---End User info -->
            <v-divider></v-divider>
            <v-list-item
              v-for="(item, i) in userprofile"
              :key="i"
              @click="onClickHandler(item)"
            >
              <v-list-item-icon>
                <v-icon> {{ item.icon }} </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <v-row class="d-flex flex-column mt-5 w-100">
      <v-col cols="12" v-for="(item, index) in items" :key="index">
        <v-card class="my-2" elevation="2">
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <v-img
                  height="70"
                  src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
                ></v-img>
              </v-col>
              <v-col cols="2" align-self="center">
                <v-card-title class="text-h3 font-weight-bold"
                  >Pesanan {{ item.id }}</v-card-title
                >
              </v-col>
              <v-col cols="2" align-self="center">
                <v-card-title class="text-h6 font-weight-bold">
                  <v-icon>mdi-calendar</v-icon>
                  {{ formatDate(item.createdAt) }}
                </v-card-title>
              </v-col>
              <v-col cols="4" align-self="center">
                <v-row
                  cols="12"
                  calss="pb-0"
                  v-for="(prod, i) in item.transactionDetails"
                  :key="i"
                >
                  <v-card-text>
                    {{ prod.product.name }} :
                    {{ formatCurrency(prod.product.price) }} x
                    {{ prod.quantity }}</v-card-text
                  >
                </v-row>
              </v-col>
              <v-col cols="2" align-self="center" justify="end">
                <v-row>
                  <v-col cols="6" justify="end">
                    <v-btn
                      outlined
                      @click="openDetailForm(item, 'edit')"
                      v-if="item.status === 'Belum Terverifikasi'"
                    >
                      Bayar
                    </v-btn>
                  </v-col>
                  <v-col cols="6" justify="end">
                    <v-btn outlined @click="openDetailForm(item, 'detail')">
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
    <PaymentDialog
      ref="openPaymentDialog"
      :refresh="refresh"
      :formatDate="formatDate"
      :formatCurrency="formatCurrency"
    />
  </v-breadcrumbs>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import BaseService from '@/services/Base';
import PaymentDialog from '@/views/user/history/PaymentInHistoryDialog.vue';

export default Vue.extend({
  name: 'History',
  components: { PaymentDialog },
  data: () => ({
    // Data General,
    items: [] as any[],
    tabItems: ['Semua', 'Belum Bayar', 'Dikemas', 'Dikirim', 'Selesai'],
    tab: 0,
    service: new BaseService(),
    userprofile: [
      {
        icon: 'mdi-home',
        title: 'Home',
        to: '/user/index',
      },
      {
        icon: 'mdi-logout',
        title: 'Logout',
        to: '/',
      },
    ],
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
    ...mapActions(['setLoading', 'setSnackbar', 'signOut']),
    onClickHandler({ title, to }) {
      if (title === 'Logout') {
        this.signOut();
      }
      this.$router.push(to);
    },

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
      const service = new BaseService(
        `/users/${this.authenticatedUser.id}/transaction`
      );
      const res = await service.get(params);
      switch (this.tab) {
        case 1:
          this.items = res.data
            .filter((item) => item.status === 'Belum Terverifikasi')
            .reverse();
          break;
        case 2:
          this.items = res.data
            .filter(
              (item) =>
                item.status === 'Dikemas' || item.status === 'Belum Proses'
            )
            .reverse();
          break;
        case 3:
          this.items = res.data
            .filter((item) => item.status === 'Dikirim')
            .reverse();
          break;
        case 4:
          this.items = res.data
            .filter((item) => item.status === 'Selesai')
            .reverse();
          break;
        default:
          this.items = res.data.reverse();
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

    openDetailForm(item, type) {
      const { openPaymentDialog }: any = this.$refs;
      openPaymentDialog.startForm(item, type);
    },

    formatDate(date) {
      return moment(date).format('DD-MM-YYYY');
    },
  },
});
</script>
