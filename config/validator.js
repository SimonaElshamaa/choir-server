module.exports = {
    customValidators: {
        /* validator to check if the given value is an array */
        isArray: function (value) {
            return Array.isArray(value);
        },
        /* validator to check if the given value is alphabitics or spaces */
        isAlphaS: function (value) {
            return value.match(/[a-z]| /i);
        },
        /* validator to check if the given value is alphanumeric or spaces */
        isAlphanumericS: function (value) {
            return value.match(/[a-z]|[0-9]| /i);
        }
    }
};