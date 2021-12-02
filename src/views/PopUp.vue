<template>
  <v-dialog v-model="showModal" max-width="450" persistent>
    <v-card>
      <v-card-text class="pt-3 text-h5 font-weight-bold">
        Maaf, untuk memasukan produk ke keranjang anda harus login terlebih
        dahulu!
      </v-card-text>
      <v-card-text>
        Sudah mempunyai akun? Jika belum ayo daftarkan akunmu!
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-btn><router-link to="/login">Login</router-link></v-btn>
        <v-btn><router-link to="/register">Register</router-link></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    showModal: false,
    comment: '',
  }),
  methods: {
    async startComment(item) {
      this.showModal = true;
      this.comment = item.comment;
    },
  },
});
</script>
