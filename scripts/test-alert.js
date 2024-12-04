// Example script to test alert thresholds

async function sendTestAlert() {
  try {
    // Replace with your API key from the dashboard
    const API_KEY = 'cm48yx1nh0001ys0wlbcuops0';
    
    const response = await fetch('http://localhost:3000/api/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer cm48yx1nh0001ys0wlbcuops0`
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
          'Authorization': `Bearer cm48yx1nh0001ys0wlbcuops0`
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
