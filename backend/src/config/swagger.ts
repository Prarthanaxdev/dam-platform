
// Swagger definition
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DAM Platform API',
      version: '1.0.0',
      description: 'API documentation for Digital Asset Management Platform',
    },
    servers: [
      { url: '/api' },
    ],
  },
  apis: ['./src/uploads/route.ts', './src/uploads/controller.ts'], // Path to the API docs
};
