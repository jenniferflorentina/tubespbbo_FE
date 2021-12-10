<template>
  <v-dialog v-model="showModal" max-width="450" persistent>
    <v-card>
      <v-card-text class="pt-3 text-h5 font-weight-bold">
        Pembayaran Berhasil!
      </v-card-text>
      <v-card-text>
        Terima kasih {{ authenticatedUser.name }} sudah berbelanja di Calleryna
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-spacer />
        <v-btn @click="showModal = false">close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  data: () => ({
    showModal: false,
    comment: '',
  }),

  computed: {
    ...mapGetters(['authenticatedUser']),
  },

  methods: {
    async startComment() {
      this.showModal = true;
    },
  },
});
</script>
