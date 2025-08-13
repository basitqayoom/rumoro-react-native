interface Environment {
  API_URL: string;
  WEBSOCKET_URL: string;
  GOOGLE_CLIENT_ID: string;
  SENTRY_DSN: string;
  ANALYTICS_KEY: string;
  ENV_NAME: 'development' | 'staging' | 'production';
}

const ENV = {
  development: {
    API_URL: 'http://localhost:8000/api/v1',
    WEBSOCKET_URL: 'ws://localhost:8000/ws',
    GOOGLE_CLIENT_ID: 'dev-google-client-id',
    SENTRY_DSN: '',
    ANALYTICS_KEY: '',
    ENV_NAME: 'development' as const,
  },
  staging: {
    API_URL: 'https://staging-api.rumoro.app/api/v1',
    WEBSOCKET_URL: 'wss://staging-api.rumoro.app/ws',
    GOOGLE_CLIENT_ID: 'staging-google-client-id',
    SENTRY_DSN: 'https://staging-sentry-dsn@sentry.io/project-id',
    ANALYTICS_KEY: 'staging-analytics-key',
    ENV_NAME: 'staging' as const,
  },
  production: {
    API_URL: 'https://api.rumoro.app/api/v1',
    WEBSOCKET_URL: 'wss://api.rumoro.app/ws',
    GOOGLE_CLIENT_ID: 'prod-google-client-id',
    SENTRY_DSN: 'https://prod-sentry-dsn@sentry.io/project-id',
    ANALYTICS_KEY: 'prod-analytics-key',
    ENV_NAME: 'production' as const,
  },
};

const getEnvironment = (): Environment => {
  const env = process.env.EXPO_PUBLIC_ENV || 'development';
  
  switch (env) {
    case 'production':
      return ENV.production;
    case 'staging':
      return ENV.staging;
    default:
      return ENV.development;
  }
};

export default getEnvironment();