<template>
  <v-row class="page-breadcrumb">
    <v-col cols="12" sm="12">
      <v-toolbar class="transparent mb-1" dense flat height="40">
        <v-toolbar-title>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <h2
                  v-bind="attrs"
                  v-on="on"
                  class="font-weight-light"
                  style="cursor: pointer"
              >{{ title }}
              </h2>
            </template>
            <span>{{ description }}</span>
          </v-tooltip>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title>
          <v-breadcrumbs :items="breadcrumbs" class="pa-0">
            <template v-if="breadcrumbs" v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
        </v-toolbar-title>
      </v-toolbar>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'BaseBreadcrumb',
  props: {
    title: String,
    breadcrumbs: Array,
    icon: String,
    description: String,
  },
};
</script>
<style lang="scss">
.page-breadcrumb {
  .v-toolbar__content {
    padding: 0;
  }
}
</style>
