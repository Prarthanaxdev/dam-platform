// Swagger definition
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DAM Platform API',
      version: '1.0.0',
      description: 'API documentation for Digital Asset Management Platform',
    },
    servers: [{ url: '/api' }],
    paths: {
      '/assets': {
        get: {
          summary: 'List all assets',
          responses: {
            200: {
              description: 'A list of assets',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { type: 'object' },
                  },
                },
              },
            },
          },
        },
      },
      '/assets/analytics': {
        get: {
          summary: 'Get asset usage analytics',
          responses: { 200: { description: 'Analytics data' } },
        },
      },
      '/assets/analytics/by-type': {
        get: {
          summary: 'Get asset type breakdown',
          responses: { 200: { description: 'Type breakdown' } },
        },
      },
      '/uploads': {
        post: {
          summary: 'Upload one or more files',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: {
                      type: 'string',
                      format: 'binary',
                    },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Upload result' } },
        },
      },
    },
  },
  apis: ['./src/uploads/route.ts', './src/uploads/controller.ts'], // Path to the API docs
};
