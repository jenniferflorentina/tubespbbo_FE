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
      <v-btn><router-link to="/auth/login"> Login</router-link> </v-btn>
      <v-btn class="mx-5"
        ><router-link to="auth/register">Sign-Up</router-link></v-btn
      >
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
              <v-list-item-title>Eirenika Joanna</v-list-item-title>
              <v-list-item-subtitle>User</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <!---End User info -->
          <v-divider></v-divider>

          <v-list-item
            v-for="(item, i) in userprofile"
            :key="i"
            color="primary"
            @click="onClickHandler(item)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
