# Google Ads Extension Audit Script

## Overview
This Google Ads script performs a comprehensive audit of all extension types across your account and generates a detailed HTML report. The script checks for proper implementation and provides actionable recommendations for:

- Sitelink Extensions
- Callout Extensions
- Structured Snippet Extensions
- Call Extensions
- Location Extensions
- Promotion Extensions
- Image Extensions

## Features
- Detailed analysis of extension implementation at account and campaign level
- Best practices and requirements for each extension type
- Comprehensive HTML report with:
  - Overview of all extension types
  - Campaign-specific extension implementation
  - Status indicators and improvement suggestions
  - Prioritized action plan
- Email notification system
- Error handling and logging

## Requirements
- Google Ads account with Editor access
- Gmail account for email notifications

## Installation
1. Go to your Google Ads account
2. Navigate to Tools & Settings > Bulk Actions > Scripts
3. Click the + button to create a new script
4. Copy the contents of `extension-audit-script.js` into the editor
5. Update the `CONFIG` object with your email address:

```javascript
var CONFIG = {
    EMAIL: {
        ENABLED: true,
        RECIPIENT: "YOUR_EMAIL_HERE",
        SUBJECT_PREFIX: "Extension Audit Report"
    }
};
```

## Usage
The script can be:
- Run manually from the Google Ads Scripts interface
- Scheduled to run automatically (recommended: weekly or monthly)

## Report Example
The generated HTML report includes:
- Extension overview with status indicators
- Campaign-level extension details
- Prioritized action items
- Best practices and requirements
- Visual indicators for missing or incomplete extensions

## Author
Geert Groot

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
For questions or custom implementations, feel free to connect on [LinkedIn](https://www.linkedin.com/in/geertgroot/)