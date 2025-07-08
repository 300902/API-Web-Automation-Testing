const fs = require('fs');
const path = require('path');

/**
 * Test data helpers
 */
class TestDataHelper {
  /**
   * Generate random email address
   */
  static generateEmail() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `test_${timestamp}_${random}@example.com`;
  }

  /**
   * Generate random username
   */
  static generateUsername() {
    const adjectives = ['cool', 'smart', 'brave', 'quick', 'happy'];
    const nouns = ['user', 'tester', 'dev', 'admin', 'guest'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    
    return `${randomAdjective}_${randomNoun}_${randomNumber}`;
  }

  /**
   * Generate random phone number
   */
  static generatePhoneNumber() {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    
    return `+1-${areaCode}-${exchange}-${number}`;
  }

  /**
   * Generate random address
   */
  static generateAddress() {
    const streets = ['Main St', 'Oak Ave', 'Park Blvd', 'First St', 'Second Ave'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
    
    const streetNumber = Math.floor(Math.random() * 9999) + 1;
    const street = streets[Math.floor(Math.random() * streets.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const zipCode = Math.floor(Math.random() * 90000) + 10000;
    
    return {
      street: `${streetNumber} ${street}`,
      city: city,
      state: state,
      zipCode: zipCode.toString(),
      country: 'USA'
    };
  }

  /**
   * Generate test user data
   */
  static generateUserData() {
    const firstName = ['John', 'Jane', 'Bob', 'Alice', 'Charlie'][Math.floor(Math.random() * 5)];
    const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)];
    
    return {
      firstName: firstName,
      lastName: lastName,
      email: this.generateEmail(),
      username: this.generateUsername(),
      phoneNumber: this.generatePhoneNumber(),
      address: this.generateAddress(),
      dateOfBirth: this.generateRandomDate(new Date('1970-01-01'), new Date('2000-12-31'))
    };
  }

  /**
   * Generate random date between two dates
   */
  static generateRandomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  }
}

/**
 * Screenshot helper for UI tests
 */
class ScreenshotHelper {
  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${name}_${timestamp}.png`;
    const screenshotPath = path.join('test-results', 'screenshots', fileName);
    
    // Ensure directory exists
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    
    return screenshotPath;
  }

  /**
   * Take screenshot of specific element
   */
  static async takeElementScreenshot(element, name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${name}_element_${timestamp}.png`;
    const screenshotPath = path.join('test-results', 'screenshots', fileName);
    
    // Ensure directory exists
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await element.screenshot({
      path: screenshotPath
    });
    
    return screenshotPath;
  }
}

/**
 * Wait helper utilities
 */
class WaitHelper {
  /**
   * Wait for element to be visible
   */
  static async waitForVisible(page, selector, timeout = 10000) {
    await page.waitForSelector(selector, { 
      state: 'visible', 
      timeout: timeout 
    });
  }

  /**
   * Wait for element to be hidden
   */
  static async waitForHidden(page, selector, timeout = 10000) {
    await page.waitForSelector(selector, { 
      state: 'hidden', 
      timeout: timeout 
    });
  }

  /**
   * Wait for API response
   */
  static async waitForApiResponse(page, url, timeout = 30000) {
    return await page.waitForResponse(
      response => response.url().includes(url) && response.status() === 200,
      { timeout: timeout }
    );
  }

  /**
   * Wait for network to be idle
   */
  static async waitForNetworkIdle(page, timeout = 30000) {
    await page.waitForLoadState('networkidle', { timeout: timeout });
  }
}

/**
 * API helper utilities
 */
class ApiHelper {
  /**
   * Create headers with authentication
   */
  static createAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Handle API response
   */
  static handleResponse(response) {
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      timing: response.timing
    };
  }

  /**
   * Create request with retry logic
   */
  static async requestWithRetry(requestFn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        console.log(`Request failed, retrying... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

/**
 * File helper utilities
 */
class FileHelper {
  /**
   * Ensure directory exists
   */
  static ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Save JSON data to file
   */
  static saveJson(filePath, data) {
    this.ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  /**
   * Load JSON data from file
   */
  static loadJson(filePath) {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading JSON from ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Get timestamp for file names
   */
  static getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }
}

/**
 * Logger utility
 */
class Logger {
  static info(message, ...args) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  }

  static warn(message, ...args) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  }

  static error(message, ...args) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  }

  static debug(message, ...args) {
    if (process.env.DEBUG) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }
}

module.exports = {
  TestDataHelper,
  ScreenshotHelper,
  WaitHelper,
  ApiHelper,
  FileHelper,
  Logger
};
