<template>
  <v-container
    class="page-wrapper d-flex align-center justify-center"
    style="min-height: calc(100vh - 8rem)"
    fluid
  >
    <v-row class="d-flex align-center justify-center">
      <v-col cols="12" lg="4" md="4" sm="12">
        <v-form ref="form" @submit.prevent="submit()">
          <v-text-field
            id="auth-login-input-username"
            v-model="username"
            :rules="[validation.required(userLabel)]"
            class="mt-4 custom-validation"
            solo
          />
          <v-text-field
            id="auth-login-input-password"
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[validation.required(passLabel)]"
            :type="showPassword ? 'text' : 'password'"
            class="custom-validation"
            solo
            @click:append="showPassword = !showPassword"
          />
          <v-btn id="auth-login-btn-submit" justify-end type="submit">
            Login
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import validation from '@/validation';

export default Vue.extend({
  name: 'Login',
  data: () => ({
    username: '',
    password: '',
    showPassword: false,
    validation,
  }),
  methods: {
    ...mapActions([
      'signIn',
      'getAuthorizationUser',
      'setLoading',
      'setSnackbar',
    ]),
    async submit() {
      if (!this.validate()) return;
      this.setLoading(true);

      const payload = {
        username: this.username,
        password: this.password,
      };

      try {
        await this.signIn(payload);
        this.$router.push('/');
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

    validate() {
      return (this.$refs.form as Vue & { validate: () => boolean }).validate();
    },
  },
});
</script>
