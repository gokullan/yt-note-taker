const Hapi = require('@hapi/hapi');
const routes = require('./routes/routes');
const winston = require('winston');
const goodWinston = require('hapi-good-winston').goodWinston;
const ecsFormat = require('@elastic/ecs-winston-format')
const hapiAuthJWT = require('hapi-auth-jwt2');
const secret = 'NeverShareYourSecret';

// logging config
const logger = winston.createLogger({
    level: 'debug',
    format: ecsFormat({ convertReqRes: true }),
    transports: [new winston.transports.File({
        filename: 'logs/log.json',
        level: 'debug'
    })],
});
const goodWinstonOptions = {
    levels: {
        response: 'debug',
        error: 'info',
    },
};
const options = {
    // ops: {
    //     interval: 1000,
    // },
    reporters: {
        winstonWithLogLevels: [goodWinston(logger, goodWinstonOptions)],
    }
};

(async () => {
    const server = Hapi.Server({
        host: 'localhost',
        port: 5000,
        "routes": {
            "cors": true,
        }
    });

    await server.register({
        plugin: require('@hapi/good'),
        // options,
    });

    // jwt config
    await server.register(hapiAuthJWT);
    server.auth.strategy('jwt', 'jwt', { 
        key: secret,
        validate:  (decoded, request, h) => {
            console.log(decoded);
            return {
                isValid: true
            }
        },
        verifyOptions: { ignoreExpiration: true }
    });

    await server.register(require('@hapi/inert'));

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);

    routes(server);
})();
