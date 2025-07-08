# API and Web UI Automation Testing Suite

Proyek ini berisi automation testing suite untuk API dan Web UI menggunakan Jest (untuk API testing) dan Playwright (untuk UI testing) dengan GitHub Actions pipeline.

## 📋 Features

- **API Testing**: Automated REST API testing menggunakan Jest dan Axios
- **Web UI Testing**: Cross-browser testing menggunakan Playwright
- **Security Testing**: Integrasi dengan OWASP ZAP
- **Performance Testing**: Load testing menggunakan K6
- **CI/CD Pipeline**: GitHub Actions dengan artifacts dan reporting
- **Docker Support**: Containerized testing environment
- **Multi-browser Testing**: Chrome, Firefox, Safari, dan mobile browsers
- **Test Reporting**: HTML reports dengan screenshots dan videos

## 🚀 Quick Start

### Prerequisites

- Node.js 18 atau lebih baru
- npm atau yarn
- Git

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd API\ Automation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Setup environment variables:
```bash
cp .env.example .env
# Edit .env file sesuai dengan konfigurasi Anda
```

### Running Tests

#### API Tests
```bash
# Run all API tests
npm run test:api

# Generate API test report
npm run test:api:report
```

#### UI Tests
```bash
# Run all UI tests
npm run test:ui

# Run UI tests dengan report
npm run test:ui:report

# Run tests di browser tertentu
npx playwright test --project=chromium
```

#### All Tests
```bash
npm test
```

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── main.yml              # GitHub Actions pipeline
├── tests/
│   ├── api/
│   │   └── api.test.js          # API test cases
│   └── ui/
│       └── ui.test.js           # UI test cases
├── reports/                     # Test reports
├── test-results/               # Test artifacts
├── performance-tests/          # Performance test scripts
├── scripts/                    # Utility scripts
├── package.json
├── playwright.config.js        # Playwright configuration
├── jest.api.config.js         # Jest configuration for API tests
├── Dockerfile                 # Docker configuration
├── .env.example              # Environment variables template
└── README.md
```

## 🔧 Configuration

### Environment Variables

Konfigurasi dapat disesuaikan melalui file `.env`:

- `API_BASE_URL`: Base URL untuk API testing
- `WEB_BASE_URL`: Base URL untuk UI testing
- `BROWSER_HEADLESS`: Jalankan browser dalam mode headless
- `TEST_TIMEOUT`: Timeout untuk test execution

### Playwright Configuration

Edit `playwright.config.js` untuk mengkustomisasi:
- Browser yang digunakan
- Viewport sizes
- Test timeouts
- Retry configuration
- Reporter settings

### Jest Configuration

Edit `jest.api.config.js` untuk mengkustomisasi:
- Test patterns
- Coverage settings
- Reporter configuration
- Timeout settings

## 📊 Test Reports

Test reports akan digenerate di:
- `reports/api/`: API test reports
- `playwright-report/`: UI test reports
- `test-results/`: Screenshots, videos, dan artifacts lainnya

## 🚀 GitHub Actions Pipeline

Pipeline akan otomatis triggered pada:
- Push ke branch `main` atau `develop`
- Pull request ke branch `main` atau `develop`

### Pipeline Jobs

1. **API Testing**: Menjalankan semua API tests
2. **Web UI Testing**: Menjalankan UI tests di multiple browsers
3. **Security Testing**: OWASP ZAP security scanning
4. **Performance Testing**: Load testing dengan K6
5. **Generate Report**: Consolidated test report
6. **Docker Build**: Build dan push Docker image (optional)

### Artifacts

Pipeline akan mengupload artifacts berikut:
- `api-test-results`: API test reports dan coverage
- `ui-test-results`: UI test reports, screenshots, videos
- `security-test-results`: Security scan reports
- `performance-test-results`: Performance test reports
- `consolidated-test-report`: Combined test report

## 🐳 Docker Usage

### Build Docker Image
```bash
docker build -t automation-tests .
```

### Run Tests in Container
```bash
docker run --rm -v $(pwd)/test-results:/app/test-results automation-tests
```

## 📝 Writing Tests

### API Tests

```javascript
describe('API Test Suite', () => {
  test('should get user data', async () => {
    const response = await axios.get(`${BASE_URL}/users/1`);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', 1);
  });
});
```

### UI Tests

```javascript
test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

## 🔍 Best Practices

1. **Test Organization**: Grup tests berdasarkan functionality
2. **Page Object Model**: Gunakan POM untuk UI tests yang kompleks
3. **Data Management**: Gunakan test data factories
4. **Error Handling**: Implement proper error handling dan cleanup
5. **Parallel Execution**: Pastikan tests dapat berjalan secara parallel
6. **Reporting**: Include meaningful assertions dan descriptions

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

Jika ada pertanyaan atau issues, silakan:
- Create GitHub issue
- Contact team melalui Slack
- Email: support@yourcompany.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Testing! 🧪**
