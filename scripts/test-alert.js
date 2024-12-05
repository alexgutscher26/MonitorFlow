// Example script to test alert thresholds
require('dotenv').config();

const API_KEY = process.env.TEST_API_KEY || 'YOUR_API_KEY_HERE';
if (!process.env.TEST_API_KEY) {
  console.warn('Warning: TEST_API_KEY not found in environment variables. Please set it in your .env file.');
}

async function sendTestAlert() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        category: 'sale',
        description: 'API Status Change',
        status: 'down',
        fields: {
          timestamp: new Date().toISOString(),
          details: 'Service is not responding',
          region: 'us-east-1'
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${error}`);
    }

    const result = await response.json();
    console.log('Alert sent successfully:', result);

    // Send an "up" event after 30 seconds
    setTimeout(async () => {
      const upResponse = await fetch('http://localhost:3000/api/v1/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          category: 'sale',
          description: 'API Status Change',
          status: 'up',
          fields: {
            timestamp: new Date().toISOString(),
            details: 'Service has recovered',
            region: 'us-east-1'
          }
        })
      });

      if (!upResponse.ok) {
        const error = await upResponse.text();
        throw new Error(`HTTP error! status: ${upResponse.status}, message: ${error}`);
      }

      const upResult = await upResponse.json();
      console.log('Recovery alert sent successfully:', upResult);
    }, 30000); // Wait 30 seconds before sending the up event
  } catch (error) {
    console.error('Failed to send alert:', error);
  }
}

// Send test alert
sendTestAlert();

async function sendSalesAlert() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        category: 'sale',
        description: 'New Sale Alert',
        status: 'up',
        fields: {
          timestamp: new Date().toISOString(),
          orderAmount: 299.99,
          currency: 'USD',
          productName: 'Premium Subscription',
          customerType: 'new',
          paymentMethod: 'credit_card',
          region: 'US'
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${error}`);
    }

    const result = await response.json();
    console.log('Sales alert sent successfully:', result);
  } catch (error) {
    console.error('Failed to send sales alert:', error);
  }
}

// Send sales test alert
sendSalesAlert();

async function sendDatabasePerformanceAlert() {
  try {
    // Send high latency alert
    const response = await fetch('http://localhost:3000/api/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        category: 'database',
        description: 'Database Performance Alert',
        status: 'warning',
        fields: {
          timestamp: new Date().toISOString(),
          latency: 2500, // 2.5 seconds
          queryType: 'SELECT',
          details: 'High query latency detected',
          database: 'production',
          table: 'users'
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${error}`);
    }

    const result = await response.json();
    console.log('Database performance alert sent successfully:', result);

    // Send recovery alert after 45 seconds
    setTimeout(async () => {
      const recoveryResponse = await fetch('http://localhost:3000/api/v1/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          category: 'database',
          description: 'Database Performance Recovery',
          status: 'up',
          fields: {
            timestamp: new Date().toISOString(),
            latency: 150, // 150ms - normal performance
            queryType: 'SELECT',
            details: 'Database performance has returned to normal',
            database: 'production',
            table: 'users'
          }
        })
      });

      if (!recoveryResponse.ok) {
        const error = await recoveryResponse.text();
        throw new Error(`HTTP error! status: ${recoveryResponse.status}, message: ${error}`);
      }

      const recoveryResult = await recoveryResponse.json();
      console.log('Database recovery alert sent successfully:', recoveryResult);
    }, 45000); // Wait 45 seconds before sending recovery
  } catch (error) {
    console.error('Failed to send database performance alert:', error);
  }
}

// Send database performance test alert
sendDatabasePerformanceAlert();
