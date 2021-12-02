<template>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      :elevation="2"
      permanent
      color="black"
      height="calc(100vh - 3rem)"
      class="rounded-xl"
    >
      <v-list-item class="ml-1 pa-2">
        <h2 class="#e6ecfc font-weight-bold">CF.</h2>
        <v-list-item-title class="ml-4">Calleryna Florist</v-list-item-title>
        <v-btn @click.stop="mini = !mini" color="black">
          <v-icon color="#f4f4f4">mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link @click="changePage(item.to)">
          <v-list-item-icon>
            <v-icon color="#f4f4f4">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list dense>
          <v-list-item class="my-2">
            <v-list-item-icon>
              <v-icon color="white">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content color="white">
              <v-list-item-title color="white">Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      drawer: true,
      items: [
        { title: 'Home', icon: 'mdi-home' , to:'/admin/index'},
        { title: 'Expenses', icon: 'mdi-wallet', to:'/admin/expenses'},
        { title: 'Transaction', icon: 'mdi-script-text', to:'/admin/index' },
        { title: 'Product Stock', icon: 'mdi-cube-outline', to:'/admin/products' },
        { title: 'General Ledger', icon: 'mdi-finance', to:'/admin/index'},
      ],
      mini: true,
    };
  },
  methods:{
    changePage(to: string){
      this.$router.push(to);
    }
  }
});
</script>

<style lang="scss" scoped>
.v-list-item {
  color: #f4f4f4 !important;
}
</style>
