const expressJwt = require('express-jwt');

let secret = process.env.ACCESS_TOKEN_SECRET;

function authJwt() {
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/products(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/categories(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/users(.*)/, method: ['GET', 'OPTIONS']},
            `/`,
            { url: /\/auth(.*)/ }
            // `/auth`,
            // `/auth/register`,
            // { url: /(.*)/ }
        ]
    });

    async function isRevoked(req, payload, done) {
        if(!(payload.role === 'admin')) {
            done(null, true);
        };

        done();
    };
};

function clientsAuth(userId) {
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            
        ]
    });

    async function isRevoked(req, payload, done) {
        if(payload.userId === userId) {
            done(null, true);
        };

        done();
    };
}

module.exports = { authJwt }