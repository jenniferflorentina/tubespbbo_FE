<template>
  <v-app-bar :color="navbarColor" dense app clipped-left clipped-right>
    <div>
      <v-btn text>Bunga</v-btn>
      <v-btn text>Bibit Bunga</v-btn>
      <v-btn text>Buket Bunga</v-btn>
      <v-btn text>Peralatan Berkebun</v-btn>
    </div>
    <v-spacer />

    <div>
      <v-btn><router-link to="/login"> Login</router-link> </v-btn>
      <v-btn class="mx-5"
        ><router-link to="/register">Sign-Up</router-link></v-btn
      >
    </div>
  </v-app-bar>
</template>
<script>
// Utilities
import { mapActions, mapState } from 'vuex';

export default {
  name: 'VerticalHeader',
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState(['navbarColor', 'sidebarDrawer']),
  },

  methods: {
    ...mapActions(['signOut']),
    showhideLogo() {
      this.showLogo = !this.showLogo;
    },
  },
};
</script>

<style lang="scss">
.v-application .theme--dark.white .theme--dark.v-btn.v-btn--icon {
  color: $font-color !important;
}
.v-sheet.v-app-bar.v-toolbar:not(.v-sheet--outlined),
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: $box-shadow;
}
.v-btn--icon.v-size--default .v-icon {
  width: 20px;
  font-size: 20px;
}
.hidelogo {
  display: none;
}
.searchinput {
  position: absolute;
  width: 100%;
  margin: 0;
  left: 0;
  z-index: 10;
  padding: 0 15px;
}
.descpart {
  max-width: 220px;
}
</style>
