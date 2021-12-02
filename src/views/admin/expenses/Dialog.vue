<template>
  <v-dialog
    v-model="isOpen"
    max-width="70rem"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="pb-4">
      <v-toolbar class="px-4">
        <v-toolbar-title>{{title}} Expense</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          class="mx-2"
          small
          v-if="type === 'detail'"
          @click="type = 'edit'"
        >
          <v-icon small color="black">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="isOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mb-4 mt-6">
        <v-form class="px-4" ref="form" @submit.prevent="save()">
          <v-row align="center" justify="center">
            <v-col class="pt-4 pb-0" cols="12" lg="12">
              <v-select
                v-model="createFields.category.value"
                :items="createFields.category.items"
                :label="createFields.category.label"
                :rules="createFields.category.rules"
                :disabled="isFormDisabled"
                outlined
              />
            </v-col>
            <v-col class="pb-0" cols="12" lg="12">
              <v-text-field
                v-model="createFields.name.value"
                :label="createFields.name.label"
                :rules="createFields.name.rules"
                :disabled="isFormDisabled"
                outlined
              />
            </v-col>
            <v-col class="pb-0" cols="12" lg="12">
              <v-autocomplete
                v-model="createFields.user.value"
                :items="createFields.user.items"
                item-text="name"
                item-value="id"
                :label="createFields.user.label"
                :rules="createFields.user.rules"
                :search-input.sync="searchName"
                clearable
                outlined
                :disabled="isFormDisabled"
              />
            </v-col>
            <v-col class="py-0" cols="12" lg="12">
              <v-menu
                v-model="createFields.releaseDate.showModal"
                :close-on-content-click="false"
                max-width="290px"
                min-width="auto"
                offset-y
                transition="scale-transition"
                :disabled="isFormDisabled"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="createFields.releaseDate.formatted"
                    v-bind="attrs"
                    v-on="on"
                    :label="createFields.releaseDate.label"
                    prepend-icon="mdi-calendar"
                    @click:append="createFields.releaseDate.showModal = true"
                    :rules="createFields.releaseDate.rules"
                    readonly
                    :disabled="isFormDisabled"
                    multi-line
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="createFields.releaseDate.value"
                  no-title
                  :disabled="isFormDisabled"
                  @input="formatDatePicker(createFields.releaseDate)"
                />
              </v-menu>
            </v-col>
            <v-col class="pb-0" cols="6">
              <v-text-field
                type="number"
                v-model="createFields.quantity.value"
                :label="createFields.quantity.label"
                :rules="createFields.quantity.rules"
                :disabled="isFormDisabled"
                outlined
              ></v-text-field>
            </v-col>
            <v-col class="pb-0" cols="6">
              <v-text-field
                type="number"
                v-model="createFields.totalAmount.value"
                :label="createFields.totalAmount.label"
                :rules="createFields.totalAmount.rules"
                :disabled="isFormDisabled"
                outlined
              ></v-text-field>
            </v-col>
            <v-col class="pb-0" cols="12">
              <v-textarea
                v-model="createFields.description.value"
                :label="createFields.description.label"
                :disabled="isFormDisabled"
                outlined
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn v-if="type !== 'detail'" color="primary" @click="save()"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import moment from 'moment';
import BaseService from '@/services/Base';

export default Vue.extend({
  name: 'CreateDialog',
  props: ['refresh', 'createFields'],
  data: () => ({
    isOpen: false,
    id: '',
    type: '',
    title: '',
    searchName:'',
  }),

  computed: {
    isFormDisabled(): boolean {
      return this.type === 'detail';
    },
  },

  watch: {
    isOpen: {
      async handler() {
        if (this.isOpen === false) {
          (this.$refs.form as Vue & { reset: () => void }).reset();
        }
      },
    },
    type:{
      async handler(){
        this.title = this.type[0].toUpperCase() + this.type.substring(1);
      }
    }
  },

  async created() {
    this.setLoading(true);
    this.fetchUser();
    this.setLoading(false);
  },

  methods: {
    ...mapActions(['setLoading', 'setSnackbar']),

    async startForm(item, type : string) {
      this.isOpen = true;
      this.type = type;
      this.title = type[0].toUpperCase() + type.substring(1);
      if (type !== 'create') {
        this.fillForm(item);
        this.id = item.id;
      }
    },

    fillForm(item: any) {
      if (!item) return;
      const {
        name,
        releaseDate,
        quantity,
        category,
        description,
        totalAmount,
        user,
      } = item;
      const dataObj = {
        name,
        releaseDate,
        quantity,
        category,
        description,
        totalAmount,
        user: user.id,
      };

      const keys = Object.keys(dataObj);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        this.createFields[key].value = dataObj[key];
      }
      this.formatDatePicker(this.createFields.releaseDate);
    },

    onButtonClick(label) {
      (this.$refs[label] as Vue & { click: () => void }).click();
    },

    async setupPayload() {
      const payload = {
        name: this.createFields.name.value,
        releaseDate: this.createFields.releaseDate.value,
        description: this.createFields.description.value,
        category: this.createFields.category.value,
        userId: this.createFields.user.value,
        quantity: Number(this.createFields.quantity.value),
        totalAmount: Number(this.createFields.totalAmount.value),
      };
      return payload;
    },

    async fetchUser() {
      this.setLoading(true);
      try {
        const service = new BaseService('/users');
        const res = await service.get('');
        this.createFields.user.items = res.data.filter(item => item.role !== 0);
      } catch (e) {
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'error',
        });
      } finally {
        this.setLoading(false);
      }
    },

    async save() {
      try {
        if (!this.validate()) return;
        this.setLoading(true);
        const service = new BaseService('/expenses');
        // Prepare payload
        const payload = await this.setupPayload();
        if (this.type === 'create') {
          await service.post(payload);
        } else {
          await service.put(this.id, payload);
        }

        this.refresh();
        this.isOpen = false;
        this.setLoading(false);
        (this.$refs.form as Vue & { reset: () => void }).reset();
      } catch (e) {
        this.isOpen = false;
        this.setLoading(false);
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'error',
        });
      }
    },
    validate() {
      return (
        this.$refs.form as Vue & {
          validate: () => boolean;
        }
      ).validate();
    },

    formatDatePicker(field) {
      field.formatted = moment(field.value).format('DD-MM-YYYY');
      field.showModal = false;
    },
  },
});
</script>
