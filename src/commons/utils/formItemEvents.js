export default {
    Input: {
        "on-change": function(e) {
            this.$emit("exvChange", e.target.value);
        }
    },
    InputNumber: {
        "on-change": function(e) {
            this.$emit("exvChange", e);
        }
    }
};
