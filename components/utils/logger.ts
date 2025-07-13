// Enhanced logger utility for production with crash reporting
export const logger = {
  info: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('[INFO]', new Date().toISOString(), ...args);
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[WARN]', new Date().toISOString(), ...args);
    }
  },
  error: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error('[ERROR]', new Date().toISOString(), ...args);
      
      // In production, you might want to send errors to a service like Sentry
      if (process.env.NODE_ENV === 'production') {
        // TODO: Integrate with crash reporting service
        // Example: Sentry.captureException(new Error(args.join(' ')));
      }
    }
  },
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[DEBUG]', new Date().toISOString(), ...args);
    }
  },
  // Production-specific logging
  crash: (error: Error, context?: any) => {
    console.error('[CRASH]', new Date().toISOString(), {
      message: error.message,
      stack: error.stack,
      context,
    });
    
    // In production, send to crash reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with crash reporting service
      // Example: Sentry.captureException(error, { extra: context });
    }
  },
  // Performance monitoring
  performance: (action: string, duration: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[PERF]', new Date().toISOString(), `${action}: ${duration}ms`);
    }
  },
  // User action tracking (for analytics)
  userAction: (action: string, data?: any) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('[USER_ACTION]', new Date().toISOString(), action, data);
      
      // In production, send to analytics service
      if (process.env.NODE_ENV === 'production') {
        // TODO: Integrate with analytics service
        // Example: Analytics.track(action, data);
      }
    }
  },
}; 