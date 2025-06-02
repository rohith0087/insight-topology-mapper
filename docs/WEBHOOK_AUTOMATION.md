
# Webhook Automation Documentation

## Overview
The Webhook Automation system enables LumenNet to automatically notify external systems when specific network events occur, enabling seamless integration with existing tools and workflows.

## Features

### 🔔 Event-Driven Notifications
- Critical alerts
- Device status changes
- Security threats
- Network anomalies
- Maintenance events
- Backup failures

### 🛠️ Easy Configuration
- Web-based webhook management
- Point-and-click event selection
- Custom headers and authentication
- Test functionality built-in

### 🔗 Integration Ready
- ServiceNow ticket creation
- Slack notifications
- PagerDuty alerting
- Custom API endpoints
- Zapier workflows

## Supported Events

### Alert Events
- `alert.critical` - Critical system alerts
- `alert.warning` - Warning-level alerts

### Device Events
- `device.offline` - Device goes offline
- `device.online` - Device comes back online

### Security Events
- `security.threat` - Security threat detected
- `network.anomaly` - Unusual network behavior

### System Events
- `backup.failed` - Backup operation failed
- `maintenance.scheduled` - Maintenance window scheduled

## Setup Guide

### 1. Access Webhook Manager
- Click the "Webhooks" button in the main toolbar
- Requires admin or network admin permissions

### 2. Create a Webhook
1. Click "Add Webhook"
2. Enter webhook details:
   - **Name**: Descriptive name (e.g., "ServiceNow Tickets")
   - **URL**: Target endpoint URL
   - **Description**: What this webhook does
3. Select event triggers
4. Configure headers if needed
5. Test the webhook
6. Save and enable

### 3. Test Your Webhook
- Use the built-in test function
- Check external system for test notifications
- Verify authentication and formatting

## Webhook Payload Format

All webhooks receive a standardized JSON payload:

```json
{
  "event": "alert.critical",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "lumennet",
  "data": {
    "message": "Critical network anomaly detected",
    "device": "Router-01",
    "severity": "critical",
    "location": "Data Center A",
    "additional_info": "..."
  }
}
```

### Event-Specific Data

#### Critical Alert
```json
{
  "event": "alert.critical",
  "data": {
    "message": "Critical alert description",
    "device": "device_name",
    "severity": "critical",
    "alert_id": "unique_id",
    "threshold_exceeded": "metric_name"
  }
}
```

#### Device Offline
```json
{
  "event": "device.offline",
  "data": {
    "device_id": "device-123",
    "device_name": "Core Switch",
    "last_seen": "2024-01-15T10:25:00Z",
    "location": "Data Center A",
    "device_type": "switch"
  }
}
```

#### Security Threat
```json
{
  "event": "security.threat",
  "data": {
    "threat_type": "malware",
    "source_ip": "192.168.1.100",
    "target_ip": "10.0.0.50",
    "severity": "high",
    "description": "Malicious traffic detected"
  }
}
```

## Common Integrations

### ServiceNow
Create incidents automatically for critical events:

**Webhook URL**: `https://instance.service-now.com/api/webhook/incidents`

**Headers**:
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

### Slack
Send notifications to Slack channels:

**Webhook URL**: `https://hooks.slack.com/services/YOUR/WEBHOOK/URL`

**Payload transformation needed**: Use Zapier or custom endpoint to format for Slack

### PagerDuty
Trigger incidents for critical alerts:

**Webhook URL**: `https://events.pagerduty.com/v2/enqueue`

**Headers**:
```json
{
  "Authorization": "Token token=YOUR_INTEGRATION_KEY",
  "Content-Type": "application/json"
}
```

### Microsoft Teams
Send cards to Teams channels via Power Automate webhook

### Zapier
Use Zapier webhooks to connect to 3000+ apps:
1. Create a Zap with "Webhook" trigger
2. Use the webhook URL in LumenNet
3. Configure actions in Zapier

## Authentication Methods

### API Key Authentication
```json
{
  "Authorization": "Bearer YOUR_API_KEY",
  "X-API-Key": "YOUR_API_KEY"
}
```

### Basic Authentication
```json
{
  "Authorization": "Basic base64(username:password)"
}
```

### Custom Headers
```json
{
  "X-Custom-Token": "your_token",
  "X-Source": "lumennet"
}
```

## Best Practices

### 🎯 Configuration
- Use descriptive webhook names
- Test webhooks before enabling
- Configure appropriate events only
- Set up proper authentication
- Use HTTPS endpoints only

### 🔄 Reliability
- Implement retry logic in receiving systems
- Handle webhook failures gracefully
- Monitor webhook success rates
- Set up backup notification methods

### 🔒 Security
- Use authentication tokens
- Validate webhook sources
- Implement rate limiting
- Log webhook activities
- Rotate tokens regularly

### 📊 Monitoring
- Track webhook success/failure rates
- Monitor external system responses
- Set up alerts for webhook failures
- Review webhook logs regularly

## Troubleshooting

### Common Issues

#### Webhook Not Firing
1. Check if webhook is enabled
2. Verify event is selected
3. Confirm event actually occurred
4. Check webhook URL accessibility

#### Authentication Failures
1. Verify token/credentials
2. Check header format
3. Confirm token permissions
4. Test with external tools (Postman)

#### Payload Issues
1. Verify endpoint expects JSON
2. Check required fields
3. Test with sample payload
4. Review external system logs

### Debug Steps
1. Use webhook test function
2. Check LumenNet logs
3. Monitor external system logs
4. Test with curl/Postman
5. Verify network connectivity

### Error Codes
- `200-299`: Success
- `400`: Bad request (check payload)
- `401`: Unauthorized (check auth)
- `403`: Forbidden (check permissions)
- `404`: Not found (check URL)
- `500`: Server error (check external system)

## API Reference

### Webhook Management API
```typescript
// Get all webhooks
GET /api/webhooks

// Create webhook
POST /api/webhooks
{
  "name": "ServiceNow Integration",
  "url": "https://instance.service-now.com/webhook",
  "events": ["alert.critical", "device.offline"],
  "headers": {"Authorization": "Bearer token"},
  "enabled": true
}

// Update webhook
PUT /api/webhooks/:id

// Delete webhook
DELETE /api/webhooks/:id

// Test webhook
POST /api/webhooks/:id/test
```

### Programmatic Triggers
```typescript
import { useWebhooks } from '@/hooks/useWebhooks';

const { triggerAlert, triggerDeviceEvent } = useWebhooks();

// Trigger critical alert
triggerAlert('critical', {
  message: 'Network anomaly detected',
  device: 'Router-01',
  severity: 'critical'
});

// Trigger device offline
triggerDeviceEvent('offline', {
  device_id: 'switch-01',
  device_name: 'Core Switch',
  last_seen: new Date().toISOString()
});
```

## Examples

### Complete ServiceNow Integration
```json
{
  "name": "ServiceNow Critical Incidents",
  "url": "https://dev12345.service-now.com/api/webhook/incident",
  "events": ["alert.critical", "security.threat"],
  "headers": {
    "Authorization": "Bearer sn_oauth_token",
    "Content-Type": "application/json",
    "X-Source": "lumennet"
  },
  "enabled": true,
  "description": "Auto-create high priority incidents for critical events"
}
```

### Slack Notification via Zapier
```json
{
  "name": "Slack Alerts",
  "url": "https://hooks.zapier.com/hooks/catch/12345/abcdef/",
  "events": ["alert.critical", "alert.warning", "device.offline"],
  "headers": {
    "Content-Type": "application/json"
  },
  "enabled": true,
  "description": "Send formatted alerts to #network-ops Slack channel"
}
```

This webhook automation system provides the foundation for integrating LumenNet with your existing operational tools and workflows.
