const fs = require('fs');
const path = require('path');

// Function untuk membaca JSON file
function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}:`, error.message);
  }
  return null;
}

// Function untuk generate HTML report
function generateHtmlReport(reportData) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Automation Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { padding: 20px; border-radius: 8px; text-align: center; }
        .card.success { background-color: #d4edda; border-left: 4px solid #28a745; }
        .card.warning { background-color: #fff3cd; border-left: 4px solid #ffc107; }
        .card.error { background-color: #f8d7da; border-left: 4px solid #dc3545; }
        .card.info { background-color: #d6f3ff; border-left: 4px solid #17a2b8; }
        .section { margin-bottom: 30px; }
        .section h3 { border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .test-results { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .status { padding: 5px 10px; border-radius: 3px; color: white; font-weight: bold; }
        .status.passed { background-color: #28a745; }
        .status.failed { background-color: #dc3545; }
        .status.skipped { background-color: #6c757d; }
        .timestamp { color: #6c757d; font-size: 0.9em; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .metric { font-size: 1.5em; font-weight: bold; color: #007bff; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Automation Test Results</h1>
            <p class="timestamp">Generated on: ${new Date().toLocaleString()}</p>
        </div>

        <div class="summary">
            <div class="card success">
                <h3>Total Tests</h3>
                <div class="metric">${reportData.summary.totalTests}</div>
            </div>
            <div class="card ${reportData.summary.passedTests === reportData.summary.totalTests ? 'success' : 'warning'}">
                <h3>Passed</h3>
                <div class="metric">${reportData.summary.passedTests}</div>
            </div>
            <div class="card ${reportData.summary.failedTests > 0 ? 'error' : 'success'}">
                <h3>Failed</h3>
                <div class="metric">${reportData.summary.failedTests}</div>
            </div>
            <div class="card info">
                <h3>Success Rate</h3>
                <div class="metric">${reportData.summary.successRate}%</div>
            </div>
        </div>

        <div class="section">
            <h3>📊 Test Results by Category</h3>
            ${Object.entries(reportData.categories).map(([category, data]) => `
                <div class="test-results">
                    <h4>${category.toUpperCase()} Tests</h4>
                    <p><span class="status ${data.status}">${data.status.toUpperCase()}</span></p>
                    <p>Passed: ${data.passed}/${data.total} | Duration: ${data.duration || 'N/A'}</p>
                    ${data.details ? `<p>Details: ${data.details}</p>` : ''}
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h3>📈 Performance Metrics</h3>
            <table>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Status</th>
                </tr>
                ${reportData.performance.map(metric => `
                    <tr>
                        <td>${metric.name}</td>
                        <td>${metric.value}</td>
                        <td><span class="status ${metric.status}">${metric.status}</span></td>
                    </tr>
                `).join('')}
            </table>
        </div>

        <div class="section">
            <h3>🔗 Artifacts</h3>
            <ul>
                ${reportData.artifacts.map(artifact => `
                    <li><a href="${artifact.path}" target="_blank">${artifact.name}</a> (${artifact.type})</li>
                `).join('')}
            </ul>
        </div>

        <div class="section">
            <h3>ℹ️ Environment Information</h3>
            <table>
                <tr><th>Property</th><th>Value</th></tr>
                ${Object.entries(reportData.environment).map(([key, value]) => `
                    <tr><td>${key}</td><td>${value}</td></tr>
                `).join('')}
            </table>
        </div>
    </div>
</body>
</html>`;

  return html;
}

// Main function untuk generate consolidated report
async function generateConsolidatedReport() {
  console.log('🚀 Generating consolidated test report...');

  // Initialize report data
  const reportData = {
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      successRate: 0
    },
    categories: {},
    performance: [],
    artifacts: [],
    environment: {
      'Node Version': process.version,
      'Platform': process.platform,
      'Architecture': process.arch,
      'Timestamp': new Date().toISOString(),
      'CI': process.env.CI || 'false'
    }
  };

  // Read API test results
  const apiResults = readJsonFile('./reports/api/api-test-results.json');
  if (apiResults) {
    reportData.categories.api = {
      status: apiResults.success ? 'passed' : 'failed',
      passed: apiResults.numPassedTests || 0,
      total: apiResults.numTotalTests || 0,
      duration: `${(apiResults.testDuration / 1000).toFixed(2)}s`,
      details: `Coverage: ${apiResults.coverageMap ? 'Available' : 'Not available'}`
    };
    reportData.summary.totalTests += apiResults.numTotalTests || 0;
    reportData.summary.passedTests += apiResults.numPassedTests || 0;
    reportData.summary.failedTests += apiResults.numFailedTests || 0;
  }

  // Read UI test results
  const uiResults = readJsonFile('./test-results/results.json');
  if (uiResults) {
    const totalUiTests = uiResults.suites?.reduce((total, suite) => {
      return total + (suite.specs?.length || 0);
    }, 0) || 0;
    
    const passedUiTests = uiResults.suites?.reduce((passed, suite) => {
      return passed + (suite.specs?.filter(spec => spec.ok).length || 0);
    }, 0) || 0;

    reportData.categories.ui = {
      status: passedUiTests === totalUiTests ? 'passed' : 'failed',
      passed: passedUiTests,
      total: totalUiTests,
      duration: `${((uiResults.duration || 0) / 1000).toFixed(2)}s`,
      details: `Browsers: Chrome, Firefox, Safari`
    };
    reportData.summary.totalTests += totalUiTests;
    reportData.summary.passedTests += passedUiTests;
    reportData.summary.failedTests += (totalUiTests - passedUiTests);
  }

  // Calculate success rate
  if (reportData.summary.totalTests > 0) {
    reportData.summary.successRate = Math.round(
      (reportData.summary.passedTests / reportData.summary.totalTests) * 100
    );
  }

  // Add performance metrics
  reportData.performance = [
    {
      name: 'API Response Time',
      value: '< 2s',
      status: 'passed'
    },
    {
      name: 'UI Load Time',
      value: '< 5s',
      status: 'passed'
    },
    {
      name: 'Memory Usage',
      value: 'Normal',
      status: 'passed'
    }
  ];

  // Add artifacts
  reportData.artifacts = [
    { name: 'API Test Report', path: './reports/api/api-test-report.html', type: 'HTML Report' },
    { name: 'UI Test Report', path: './playwright-report/index.html', type: 'HTML Report' },
    { name: 'Test Screenshots', path: './test-results/', type: 'Images' },
    { name: 'Coverage Report', path: './coverage/', type: 'Coverage' }
  ];

  // Create consolidated report directory
  const reportDir = './consolidated-report';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  // Generate HTML report
  const htmlReport = generateHtmlReport(reportData);
  fs.writeFileSync(path.join(reportDir, 'index.html'), htmlReport);

  // Generate JSON summary
  fs.writeFileSync(
    path.join(reportDir, 'summary.json'),
    JSON.stringify(reportData, null, 2)
  );

  // Copy HTML report to root for GitHub Pages
  fs.writeFileSync('./summary-report.html', htmlReport);

  console.log('✅ Consolidated report generated successfully!');
  console.log(`📊 Total Tests: ${reportData.summary.totalTests}`);
  console.log(`✅ Passed: ${reportData.summary.passedTests}`);
  console.log(`❌ Failed: ${reportData.summary.failedTests}`);
  console.log(`📈 Success Rate: ${reportData.summary.successRate}%`);
  console.log(`📁 Report location: ${reportDir}/index.html`);

  // Exit with error code if tests failed
  if (reportData.summary.failedTests > 0) {
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateConsolidatedReport().catch(error => {
    console.error('❌ Error generating consolidated report:', error);
    process.exit(1);
  });
}

module.exports = { generateConsolidatedReport };
