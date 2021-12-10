<template>
  <v-navigation-drawer
    id="main-sidebar"
    v-model="sidebarDrawer"
    v-bar
    color="black"
    :expand-on-hover="expandOnHover"
    app
    clipped
    :mini-variant.sync="mini"
    mini-variant-width="70"
    mobile-breakpoint="960"
  >
    <v-list-item class="ml-1 pa-2">
        <h2 class="#e6ecfc font-weight-bold">CF.</h2>
        <v-list-item-title class="ml-4">Calleryna Florist</v-list-item-title>
        <v-btn @click.stop="mini = !mini" color="black">
          <v-icon color="#f4f4f4">mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>
    <v-list class="mt-1" expand nav>
      <template v-for="(item, i) in items">
        <v-row v-if="item.header" :key="item.header" class="d-none">
          <v-col cols="12">
            <v-subheader v-if="item.header" class="d-block">
              {{ item.header }}
            </v-subheader>
          </v-col>
        </v-row>

        <base-item-group
          v-else-if="item.children"
          :key="`group-${i}`"
          :item="item"
          class="icon-size"
        />

        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>
    </v-list>
    <template v-slot:append>
        <v-list expand nav>
          <v-list-item class="my-2" @click="onClickHandler()">
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

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import BaseItemGroup from '@/components/sidebarItems/BaseItemGroup.vue';
import BaseItem from '@/components/sidebarItems/BaseItem.vue';
import VerticalSidebarItems from './SidebarItems';

export default {
  name: 'VerticalSidebar',
  components: { BaseItemGroup, BaseItem },
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    items: VerticalSidebarItems,
    mini: true,
  }),
  computed: {
    ...mapState(['sidebarColor', 'SidebarBg']),
    ...mapGetters(['authenticatedUser']),
    sidebarDrawer: {
      get() {
        return this.$store.state.sidebarDrawer;
      },
      set(val) {
        this.$store.commit('SET_SIDEBAR_DRAWER', val);
      },
    },
    
  },
  methods:{
    ...mapActions(['signOut']),
    onClickHandler() {
      this.signOut();
      this.$router.push('/');
    },
  }
};
</script>
<style lang="scss" scoped>
#main-sidebar {
  box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  -webkit-box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  .v-navigation-drawer__border {
    display: none;
  }
  .v-list {
    padding: 8px 15px;
  }
  .v-list-item {
    min-height: 35px;
    color: white;
    &__icon--text,
    &__icon:first-child {
      justify-content: center;
      text-align: center;
      width: 20px;
    }
  }
  .v-list-item__icon i {
    width: 20px;
  }
  .v-list-item {
    color: #f4f4f4 !important;
  }
  .icon-size .v-list-group__items i {
    width: 16px;
    font-size: 16px;
  }
  .profile-bg {
    &.theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
      opacity: 1;
    }
    .v-avatar {
      padding: 15px 0;
    }
  }
  .theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
