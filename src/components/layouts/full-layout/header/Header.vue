<template>
  <v-app-bar
    :color="navbarColor"
    :dark="navbarColor !== 'white'"
    app
    clipped-left
    clipped-right
  >
    <!---Logo -->
    <v-toolbar-title
      v-if="navbarColor !== 'white'"
      class="align-center d-flex logo-width"
    >
      <span class="logo-icon">
        <router-link to="/">
          <img
            alt=" ogo"
            class="mt-2"
            style="height: 3rem"
          />
        </router-link>
      </span>
    </v-toolbar-title>

    <!---Dark Logo -->
    <v-toolbar-title v-else class="align-center d-flex">
      <span class="logo-icon">
        <router-link to="/">
          <img
            alt="logo"
            class="mt-2"
            style="height: 3rem"
          />
        </router-link>
      </span>
    </v-toolbar-title>
    <!---Logo part -->

    <!--- Toggle sidebar -->
    <div @click="showhideLogo">
      <v-app-bar-nav-icon
        @click="
          $vuetify.breakpoint.smAndDown
            ? setSidebarDrawer(!sidebarDrawer)
            : $emit('input', !value)
        "
      />
    </div>
    <v-spacer />

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
              alt="John"
              src="https://randomuser.me/api/portraits/men/81.jpg"
            />
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <!---User info -->
        <v-list-item>
          <v-list-item-avatar>
            <img
              alt="John"
              src="https://randomuser.me/api/portraits/men/81.jpg"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Donathan Deo</v-list-item-title>
            <v-list-item-subtitle>Webdesigner</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
              <v-icon>mdi-heart</v-icon>
            </v-btn>
          </v-list-item-action>
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

    <!---User -->
  </v-app-bar>
</template>
<script>
// Utilities
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'VerticalHeader',
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    showLogo: true,
    showSearch: false,
    fav: true,
    notifications: [
      {
        title: 'Launch Admin',
        iconbg: 'error',
        icon: 'mdi-link-variant',
        desc: 'Just see the my new admin!',
        time: '9:30AM',
      },
      {
        title: 'Event today',
        iconbg: 'success',
        icon: 'mdi-calendar-check',
        desc: 'Just a reminder that you have event',
        time: '10:30AM',
      },
      {
        title: 'Settings',
        iconbg: 'info',
        icon: 'mdi-cog',
        desc: 'You can customize this template as you want',
        time: '11:30AM',
      },
      {
        title: 'Pavan Kumar',
        iconbg: 'warning',
        icon: 'mdi-account',
        desc: 'Sent you an notification',
        time: '12:30AM',
      },
    ],
    messages: [
      {
        title: 'Sonu Nigam',
        avatar: '1',
        avatarstatus: 'success',
        desc: 'Singing Show tonigh at 9pm!',
        time: '9:30AM',
      },
      {
        title: 'Sonu Nigam',
        avatar: '2',
        avatarstatus: 'error',
        desc: 'The greate malody songs ever sung',
        time: '10:30AM',
      },
      {
        title: 'Arijit singh',
        avatar: '3',
        avatarstatus: 'warning',
        desc: 'You can customize this template as you want',
        time: '11:30AM',
      },
      {
        title: 'Pavan Kumar',
        avatar: '4',
        avatarstatus: 'success',
        desc: 'Sent you an notification',
        time: '12:30AM',
      },
    ],
    userprofile: [
      {
        title: 'My Profile',
        to: '/profile',
      },
      {
        title: 'Sign Out',
        to: `//auth/signIn`,
      },
    ],
    href() {
      return undefined;
    },
  }),

  computed: {
    ...mapState(['navbarColor', 'sidebarDrawer']),
  },

  methods: {
    ...mapActions(['signOut']),
    ...mapMutations({
      setSidebarDrawer: 'SET_SIDEBAR_DRAWER',
    }),
    showhideLogo() {
      this.showLogo = !this.showLogo;
    },

    searchbox() {
      this.showSearch = !this.showSearch;
    },

    onClickHandler({ title, to }) {
      if (title === 'Sign Out') {
        this.signOut();
      }
      this.$router.push(to);
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
