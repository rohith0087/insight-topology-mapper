
# Contextual Help System Documentation

## Overview
The Contextual Help System provides intelligent, context-aware assistance to users based on their current location, role, and experience level within LumenNet.

## Features

### 🎯 Smart Tooltips
- **Role-based content**: Different help text based on user permissions
- **Page-aware**: Context changes based on current page/section
- **Experience-aware**: Special hints for first-time users
- **Non-intrusive**: Appears on hover, doesn't block workflow

### 🧠 Intelligent Context Detection
- Detects user role (admin, viewer, etc.)
- Tracks current page/section
- Identifies first-time users
- Remembers user preferences

### ⚙️ User Preferences
- Toggle tooltips on/off
- Enable/disable advanced tips
- Auto-show help for new features

## Implementation

### Basic Usage

```tsx
import ContextualTooltip from '@/components/help/ContextualTooltip';

<ContextualTooltip
  content="This button starts network discovery"
  context="network-discovery"
  userRole={userRole}
  currentPage="topology"
>
  <Button>Start Discovery</Button>
</ContextualTooltip>
```

### Help Provider Setup

```tsx
import { HelpProvider } from '@/components/help/HelpSystem';

function App() {
  return (
    <HelpProvider>
      {/* Your app content */}
    </HelpProvider>
  );
}
```

### Smart Help Button

```tsx
import SmartHelpButton from '@/components/help/SmartHelpButton';

<SmartHelpButton
  context="data-sources"
  helpContent="Data sources provide network information to LumenNet..."
/>
```

## Best Practices

### ✅ Do's
- Keep help text concise and actionable
- Use role-specific language
- Include keyboard shortcuts when relevant
- Test with different user roles
- Avoid overwhelming users with too many tooltips

### ❌ Don'ts
- Don't show tooltips on every element
- Don't use technical jargon for non-technical users
- Don't make tooltips modal or blocking
- Don't forget to test tooltip positioning
- Don't hardcode user roles in components

## Configuration

### Tooltip Positioning
```tsx
<ContextualTooltip
  side="top" // top, right, bottom, left
  delayDuration={300} // milliseconds
>
```

### Role-based Content
The system automatically adjusts content based on user roles:
- **super_admin**: Full access hints
- **tenant_admin**: Organization management tips
- **network_admin**: Network operation guidance
- **viewer**: Read-only explanations

### User Experience Levels
- **First-time users**: Extended help with getting started tips
- **Returning users**: Focused, concise help
- **Expert users**: Can disable tooltips entirely

## Analytics and Tracking

The system tracks help interactions to improve the user experience:
- Which help topics are accessed most
- Where users need the most help
- Effectiveness of help content

```tsx
// Tracked automatically when using useHelp hook
const { trackHelpInteraction } = useHelp();
trackHelpInteraction('tooltip_viewed', 'network-filters');
```

## Customization

### Custom Help Content
```tsx
const getSmartContent = (baseContent, context) => {
  if (context === 'advanced-feature' && userRole === 'viewer') {
    return baseContent + ' (Contact your admin to enable this feature)';
  }
  return baseContent;
};
```

### Styling
The help system uses Tailwind CSS and can be customized:
```tsx
<ContextualTooltip
  className="custom-tooltip-wrapper"
  content="..."
>
```

## Integration Points

### With Authentication
- Automatically detects user roles
- Adjusts content based on permissions
- Tracks user experience level

### With Navigation
- Updates context when pages change
- Provides page-specific help
- Maintains help state across navigation

### With Features
- Provides feature-specific guidance
- Explains complex workflows
- Offers keyboard shortcuts and tips

## Troubleshooting

### Common Issues
1. **Tooltips not showing**: Check if user has disabled them in preferences
2. **Wrong content**: Verify role detection and page context
3. **Performance issues**: Reduce tooltip delay or implement lazy loading

### Debug Mode
Enable debug logging to troubleshoot:
```tsx
const { trackHelpInteraction } = useHelp();
// Check console for help system logs
```

## Future Enhancements
- Interactive tutorials
- Video help content
- Multi-language support
- A/B testing for help content
- Integration with support ticketing
