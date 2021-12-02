<template>
  <v-app id="inspire">
    =
    <v-main>
      <v-container class="page-wrapper" fluid>
        <transition
          enter-active-class="fade-enter-active fade-enter"
          leave-active-class="fade-leave-active fade-enter"
          name="router-anim"
        >
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>
    <HeaderComponent />
  </v-app>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import HeaderComponent from './header/HeaderUser.vue';

export default {
  name: 'Layout',
  components: {
    HeaderComponent,
  },
  props: {
    source: String,
  },
  data: () => ({
    expandOnHover: false,
  }),
  computed: {
    ...mapState(['customizerDrawer', 'setHorizontalLayout']),
  },
  methods: {
    ...mapMutations({
      setCustomizerDrawer: 'SET_CUSTOMIZER_DRAWER',
    }),
  },
};
</script>
