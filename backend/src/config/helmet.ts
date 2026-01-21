import helmet from "helmet";

export const helmetConfig = helmet({
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  noSniff: true,
  xssFilter: true,

  hsts: process.env.NODE_ENV === "production"
    ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      }
    : false,

  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      mediaSrc: ["'self'", "blob:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
});
