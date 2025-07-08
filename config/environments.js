module.exports = {
  development: {
    api: {
      baseURL: 'http://localhost:3000/api',
      timeout: 5000,
      retries: 1
    },
    web: {
      baseURL: 'http://localhost:3000',
      headless: false,
      viewport: { width: 1280, height: 720 },
      timeout: 30000
    },
    database: {
      host: 'localhost',
      port: 5432,
      name: 'test_db_dev',
      username: 'dev_user',
      password: 'dev_password'
    }
  },
  
  testing: {
    api: {
      baseURL: 'https://test-api.example.com',
      timeout: 10000,
      retries: 2
    },
    web: {
      baseURL: 'https://test-app.example.com',
      headless: true,
      viewport: { width: 1280, height: 720 },
      timeout: 30000
    },
    database: {
      host: 'test-db.example.com',
      port: 5432,
      name: 'test_db',
      username: 'test_user',
      password: 'test_password'
    }
  },
  
  staging: {
    api: {
      baseURL: 'https://staging-api.example.com',
      timeout: 15000,
      retries: 3
    },
    web: {
      baseURL: 'https://staging-app.example.com',
      headless: true,
      viewport: { width: 1280, height: 720 },
      timeout: 45000
    },
    database: {
      host: 'staging-db.example.com',
      port: 5432,
      name: 'staging_db',
      username: 'staging_user',
      password: 'staging_password'
    }
  },
  
  production: {
    api: {
      baseURL: 'https://api.example.com',
      timeout: 20000,
      retries: 3
    },
    web: {
      baseURL: 'https://app.example.com',
      headless: true,
      viewport: { width: 1280, height: 720 },
      timeout: 60000
    },
    database: {
      host: 'prod-db.example.com',
      port: 5432,
      name: 'prod_db',
      username: 'prod_user',
      password: 'prod_password'
    }
  }
};
