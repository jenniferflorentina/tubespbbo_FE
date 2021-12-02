<template>
  <v-list-group
    v-if="children.length > 0"
    :group="group"
    :sub-group="subGroup"
    active-class="white--text"
  >
    <template v-slot:activator>
      <v-list-item-icon v-if="item.icon" class="icon">
        <feather :type="item.icon" />
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title v-text="item.title" />
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in children">
      <base-item-sub-group
        v-if="child.children"
        :key="`sub-group-${i}`"
        :item="child"
        class="second-dd"
      />

      <base-item
        v-else-if="isActive(child.flag)"
        :key="`item-${i}`"
        :item="child"
        text
      />
    </template>
  </v-list-group>
</template>

<script>
// Utilities
import kebabCase from 'lodash/kebabCase';
import BaseItemSubGroup from '@/components/sidebarItems/BaseItemSubGroup.vue';
import BaseItem from '@/components/sidebarItems/BaseItem.vue';

export default {
  name: 'BaseItemGroup',
  components: { BaseItemSubGroup, BaseItem },
  inheritAttrs: false,

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
    subGroup: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    children() {
      const activeChildren = this.item.children.filter((child) =>
        this.isActive(child.flag)
      );
      return activeChildren.map((item) => ({
        ...item,
        to: !item.to ? undefined : `${this.item.group}/${item.to}`,
      }));
    },
    group() {
      return this.genGroup(this.item.children);
    },
  },

  methods: {
    isActive(flag) {
      if (flag) {
        return true;
      }
      return false;
    },
    genGroup(children) {
      return children
        .filter((item) => item.to)
        .map((item) => {
          const parent = item.group || this.item.group;
          let group = `${parent}/${kebabCase(item.to)}`;

          if (item.children) {
            group = `${group}|${this.genGroup(item.children)}`;
          }

          return group;
        })
        .join('|');
    },
  },
};
</script>

<style></style>
