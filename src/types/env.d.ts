/**
 * Type declarations for environment variables
 * This file provides type safety and documentation for all environment variables used in the application
 */

/**
 * Available deployment environments
 */
type Environment = 'development' | 'production' | 'test';

/**
 * Database connection configuration
 */
interface DatabaseEnv {
  /** PostgreSQL database URL */
  DATABASE_URL: string;
  /** Database connection pool size */
  DATABASE_POOL_SIZE?: string;
}

/**
 * Authentication configuration
 */
interface AuthEnv {
  /** JWT secret key for token signing */
  JWT_SECRET: string;
  /** JWT token expiration time in seconds */
  JWT_EXPIRES_IN?: string;
  /** Google OAuth client ID */
  GOOGLE_CLIENT_ID?: string;
  /** Google OAuth client secret */
  GOOGLE_CLIENT_SECRET?: string;
}

/**
 * Server configuration
 */
interface ServerEnv {
  /** Port number for the server to listen on */
  PORT?: string;
  /** Allowed CORS origins (comma-separated) */
  CORS_ORIGIN?: string;
  /** Node environment */
  NODE_ENV: Environment;
}

/**
 * Email service configuration
 */
interface EmailEnv {
  /** SMTP server host */
  SMTP_HOST?: string;
  /** SMTP server port */
  SMTP_PORT?: string;
  /** SMTP username */
  SMTP_USER?: string;
  /** SMTP password */
  SMTP_PASS?: string;
  /** Default 'from' email address */
  EMAIL_FROM?: string;
}

/**
 * Payment service configuration
 */
interface PaymentEnv {
  /** Stripe secret key */
  STRIPE_SECRET_KEY?: string;
  /** Stripe webhook secret */
  STRIPE_WEBHOOK_SECRET?: string;
  /** Stripe price ID for pro subscription */
  STRIPE_PRO_PRICE_ID?: string;
}

/**
 * Monitoring and logging configuration
 */
interface MonitoringEnv {
  /** Sentry DSN for error tracking */
  SENTRY_DSN?: string;
  /** Log level (debug, info, warn, error) */
  LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
}

declare global {
  namespace NodeJS {
    /**
     * Extended ProcessEnv interface with strongly typed environment variables
     */
    interface ProcessEnv 
      extends DatabaseEnv,
              AuthEnv,
              ServerEnv,
              EmailEnv,
              PaymentEnv,
              MonitoringEnv {}
  }
}

// This export is needed to make this a module
export {}
