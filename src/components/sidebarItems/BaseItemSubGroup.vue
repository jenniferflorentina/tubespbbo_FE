<template>

  <base-item-group
      :item="item"
      :prepend-icon="item.icon"
      append-icon="mdi-menu-down"
      class="xyz"
      sub-group
      text
  />
</template>

<script>
import BaseItemGroup from '@/components/sidebarItems/BaseItemGroup.vue';

export default {
  name: 'BaseItemSubGroup',
  components: { BaseItemGroup },
  props: {
    item: {
      type: Object,
      default: () => ({
        avatar: undefined,
        group: undefined,
        title: undefined,
        children: [],
      }),
    },
  },
  methods: {
    isActive(flag) {
      return true;
      // return this.$featureFlag.isVisible(flag);
    },
  },
};
</script>
