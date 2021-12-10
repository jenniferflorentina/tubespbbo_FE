<template>
  <v-dialog
    v-model="isOpen"
    max-width="70rem"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="pb-4">
      <v-toolbar class="px-4">
        <v-toolbar-title>{{title}} Product</v-toolbar-title>
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
        <v-form class="px-4 pt-4" ref="form" @submit.prevent="save()">
          <v-row align="center" justify="center">
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
              <v-text-field
                v-model="createFields.code.value"
                :label="createFields.code.label"
                :rules="createFields.code.rules"
                :disabled="isFormDisabled"
                outlined
              />
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
          <v-row align="start" justify="center">
              <input
                ref="Document"
                class="d-none"
                type="file"
                accept="image/*"
                @change="
                  (e) => {
                    fileInput = e.target.files[0];
                    onPickedImage(e.target.value);
                  }
                "
              />
            <v-col cols=4  @click="onImageClick()">
              <v-img v-if="url" max-width="250"
                height="250" :src="url" />
              <v-img 
                v-else-if="createFields.imageurl.value !== ''" 
                max-width="250"
                height="250" 
                :src="createFields.imageurl.value"
                @error="createFields.imageurl.value = 'https://cdn.vuetifyjs.com/images/cards/cooking.png'"
                >
              </v-img>
              <v-img
                v-else
                max-width="250"
                height="250"
                src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
              ></v-img>
            </v-col>
            <v-col class="pb-0" cols="8">
               <v-row align="end" justify="end">
                <v-col class="pb-0" cols="12">
                  <v-text-field
                    type="number"
                    v-model="createFields.price.value"
                    :label="createFields.price.label"
                    :rules="createFields.price.rules"
                    :disabled="isFormDisabled"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
               <v-row align="end" justify="end">
                <v-col class="pb-0" cols="12">
                  <v-text-field
                    type="number"
                    v-model="createFields.quantity.value"
                    :label="createFields.quantity.label"
                    :rules="createFields.quantity.rules"
                    :disabled="isFormDisabled"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
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
import BaseService from '@/services/Base';

export default Vue.extend({
  name: 'CreateDialog',
  props: ['refresh', 'createFields'],
  data: () => ({
    isOpen: false,
    id: '',
    type: '',
    title: '',
    fileInput: null as any,
    url: null as any,
    path: '' as any,
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
          this.url = null;
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
        code,
        quantity,
        ImageUrl,
        description,
        price,
      } = item;
      const dataObj = {
        name,
        code,
        quantity,
        imageurl: ImageUrl,
        description,
        price,
      };

      const keys = Object.keys(dataObj);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        this.createFields[key].value = dataObj[key];
      }
    },

    onButtonClick(label) {
      (this.$refs[label] as Vue & { click: () => void }).click();
    },

    async setupPayload() {
      const payload = {
        name: this.createFields.name.value,
        code: this.createFields.code.value,
        description: this.createFields.description.value,
        imageurl: URL.createObjectURL(this.fileInput),
        quantity: Number(this.createFields.quantity.value),
        price: Number(this.createFields.price.value),
      };
      return payload;
    },

    async save() {
      try {
        if (!this.validate()) return;
        this.setLoading(true);
        const service = new BaseService('/products');
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
    onImageClick() {
      const { Document } = this.$refs as any;
      Document.click();
    },
    onPickedImage(e) {
      const formData = new FormData();

      formData.append('file', this.fileInput);
      this.url = URL.createObjectURL(this.fileInput)
      this.path = e;


    },
  },
});
</script>
