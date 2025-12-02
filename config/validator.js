module.exports = {
  customValidators: {
    /**
     * Check if the given value is an array
     * @param {any} value
     * @returns {boolean}
     */
    isArray: (value) => Array.isArray(value),

    /**
     * Check if the given value contains only alphabetic characters or spaces
     * @param {string} value
     * @returns {boolean}
     */
    isAlphaS: (value) => /^[a-zA-Z\s]+$/.test(value),

    /**
     * Check if the given value contains only alphanumeric characters or spaces
     * @param {string} value
     * @returns {boolean}
     */
    isAlphanumericS: (value) => /^[a-zA-Z0-9\s]+$/.test(value)
  }
};
