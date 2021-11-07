export default {
  required: (fieldName) => (v) => !!v || `${fieldName} is required`,
  isValidEmail: () => ((v) => {
    if (v) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(v).toLowerCase());
    }
    return true;
  }) || `E-mail is not valid`,
  minLength: (fieldName, min) => (v) => v?.length >= min || `${fieldName} more than ${min} characters`,
  maxLength: (fieldName, max) => (v) => {
    if (!v) return true;
    return v.length <= max || `${fieldName} less than ${max} characters`;
  },
  confirmPassword: (password) => (v) => v === password || `Password does not match!`,
  phoneNumber: () => (v) => {
    if (!v) return true;
    return /^-?[\d.]+(?:e-?\d+)?$/.test(v) || `not a phone number format`;
  },
  isNumber: () => (v) => {
    if (!v) return true;
    return /^[0-9]*$/.test(v) || `not a number`;
  },
  isCurrency: () => (v) => {
    if (!v) return true;
    return /^\d{1,3}(,\d{3})*(\.\d+)?$/.test(v) || `not a currency`;
  }
};
