<template>
  <div>
    <header-component />
    <v-form @submit.prevent="save()">
      <v-container class="my-10">
        <v-row>
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
            <v-menu
              v-model="modalDob"
              :close-on-content-click="false"
              max-width="290px"
              min-width="auto"
              offset-y
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="formattedDob"
                  v-bind="attrs"
                  v-on="on"
                  label="Date of Birth"
                  append-icon="mdi-calendar"
                  @click:append="modalDob = true"
                  readonly
                  outlined
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="payload.dob"
                no-title
                @input="formatDatePicker"
              />
            </v-menu>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import moment from 'moment';
import BaseService from '@/services/Base';
import HeaderComponent from '@/components/layouts/full-layout-user/header/Header.vue';
import { Users } from '@/types/User';

export default Vue.extend({
  name: 'Register',
  components: {
    HeaderComponent,
  },
  data: () => ({
    service: new BaseService(),
    payload: {} as Users,
    modalDob: false,
    formattedDob: '',
    showPassword: false,
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
        this.$router.push('/login');
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

    formatDatePicker() {
      this.formattedDob = moment(this.payload.dob).format('DD-MM-YYYY');
      this.modalDob = false;
    },
  },
});
</script>
