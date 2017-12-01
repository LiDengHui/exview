/* eslint-disable */
let Mock = require("mockjs");
let Random = Mock.Random;

module.exports = function() {
    var data = {
        user: []
    };

    var images = [1, 2, 3].map(x =>
        Random.image("200x100", Random.color(), Random.word(2, 6))
    );

    for (var i = 0; i < 100; i++) {
        let user = Mock.mock({
            id: Random.id(),
            name: Random.cname(),
            sex: Random.integer(1, 2),
            age: Random.integer(0, 100),
            phone: /^1[0-9]{10}$/,
            email: Random.email(),
            "_checked|1": [true, false]
        });

        if (i < 20) {
            user._checked = false;
        }
        data.user.push(user);
    }

    return data;
};
