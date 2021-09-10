const path = require('path');
const fastify = require('fastify')({
  logger: {
    prettyPrint: true,
    redact: ['req'],
    level: 'warn',
    serializers: {
      res(res) {
        return {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
        };
      },
    }
  }
});

global.__basedir = __dirname;

const AutoLoad = require('fastify-autoload');

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins'),
  options: {}
});

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'hooks'),
  options: {}
});



const baseServicesFolder = path.join(__dirname, 'services').replace(/\\/g, '/');
for (const folder of require('glob').sync(baseServicesFolder + '/**/'))
  fastify.register(AutoLoad, {
    dir: folder,
    ignorePattern: /^(.(?!\.js$))+$/,
    options: {
      prefix: folder.replace(baseServicesFolder, '').replace(/_([^./]+)\//g, ':$1/')
    }
  });

fastify.ready(function () {
  process.title = fastify.config.process;
  if (require('./runtime/argv-parse')(fastify)) return;
  fastify.swagger();
  fastify.blipp();
  fastify.listen({ port: fastify.config.web_port });
});