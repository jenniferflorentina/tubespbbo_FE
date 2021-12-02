<template>
  <v-list-item
      :href="href"
      :rel="href && href !== '#' ? 'noopener' : undefined"
      :target="href && href !== '#' ? '_blank' : undefined"
      :to="item.to"
      active-class="white--text"
  >
    <v-list-item-icon v-if="item.icon" class="icon">
      <v-icon color="#f4f4f4">{{ item.icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-icon v-else/>
    <v-list-item-content v-if="item.title">
      <v-list-item-title v-text="item.title"/>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue';
import Themeable from 'vuetify/lib/mixins/themeable';

export default Vue.extend({
  name: 'BaseItem',
  mixins: [Themeable],
  props: {
    item: {
      type: Object,
      default: () => ({
        href: undefined,
        icon: undefined,
        title: undefined,
        to: undefined,
      }),
    },
    text: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    href() {
      return this.item.href || (!this.item.to ? '#' : undefined);
    },
  },
});
</script>
