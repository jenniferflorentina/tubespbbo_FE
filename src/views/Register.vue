<template>
  <v-form @submit.prevent="save()">
    <v-container class="my-15">
      <v-row class="my-5">
        <v-col md="6" offset-md="3">
          <h3 class="my-3">Sign Up</h3>
          <v-text-field
            v-model="payload.username"
            label="Username"
            outlined
            clearable
          ></v-text-field>
          <v-text-field
            v-model="payload.password"
            label="Password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            class="custom-validation"
            outlined
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-text-field
            v-model="payload.name"
            label="Name"
            outlined
            clearable
          ></v-text-field>
          <v-text-field
            v-model="payload.dob"
            label="Date of Birth"
            append-icon="mdi-calendar"
            outlined
            clearable
          ></v-text-field>
          <v-text-field
            v-model="payload.address"
            label="Address"
            outlined
            clearable
          ></v-text-field>
          <v-text-field
            v-model="payload.phone"
            label="Phone Number"
            outlined
            clearable
          ></v-text-field>
          <v-text-field
            v-model="payload.email"
            label="Email"
            outlined
            clearable
          ></v-text-field>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="save()">Sign-Up</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import moment from 'moment';
import BaseService from '@/services/Base';
import { Users } from '@/types/User';

export default Vue.extend({
  name: 'Register',
  data: () => ({
    service: new BaseService(),
    payload: {} as Users,
  }),

  async created() {
    try {
      this.setLoading(true);
      this.setLoading(false);
    } catch (e) {
      this.setLoading(false);
      this.setSnackbar({
        isVisible: true,
        message: e,
        color: 'error',
      });
    }
  },

  methods: {
    ...mapActions(['setLoading', 'setSnackbar']),

    async save() {
      try {
        this.setLoading(true);
        this.service = new BaseService('/users');
        this.payload = {
          username: this.payload.username,
          password: this.payload.password,
          name: this.payload.name,
          dob: this.payload.dob,
          address: this.payload.address,
          phone: this.payload.phone,
          email: this.payload.email,
        };
        await this.service.post(this.payload);
        this.setSnackbar({
          isVisible: true,
          message: 'Welcome To Calleryna :)',
          color: 'success',
        });
        this.setLoading(false);
      } catch (e) {
        this.setLoading(false);
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'danger',
        });
      }
    },

    onButtonClick(label) {
      (this.$refs[label] as Vue & { click: () => void }).click();
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
