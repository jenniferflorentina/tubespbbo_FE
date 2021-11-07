<template>
  <div>
    <index-navbar />
    <section
      class="header relative pt-16 items-center flex h-screen max-h-860-px"
    >
      <v-row v-for="item, index in items" :key="index">
        <p>{{item.code}}</p>
        <h1>{{item.name}}</h1>
        <h3>{{item.price}}</h3>
      </v-row>
    </section>
    <footer-component />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import IndexNavbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import { mapActions, mapGetters } from 'vuex';
import BaseService from "@/services/Base";

export default Vue.extend({
  name: 'Index',
  components: {
    IndexNavbar,
    FooterComponent,
  },

  data: () => ({
    // Data General,
    items: [] as any[],
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
      const service = new BaseService('/products');
      const res = await service.get(params);
      this.items = res.data;
      this.$forceUpdate();
    },
  },
});
</script>
