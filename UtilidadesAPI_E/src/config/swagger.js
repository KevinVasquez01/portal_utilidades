const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configura Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'UtilidadesAPI',
            version: '1.0.0',
            description: 'API Documentation'
        },
        servers: [
            {
                url: `http://localhost:3000`
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/models/*.js'] // Aquí puedes especificar dónde se encuentran tus archivos de rutas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;