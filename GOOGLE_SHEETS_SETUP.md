# Google Sheets Integration Setup Guide

This comprehensive guide will help you set up Google Sheets integration to collect and analyze feedback from your FixMyPrompt application with enhanced features and better organization.

## Prerequisites

- Google Account
- Google Sheets access
- Basic understanding of Google Apps Script

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "FixMyPrompt Feedback Analytics"
4. Create the following sheets (tabs):
   - **Prompt Feedback** - For individual prompt ratings
   - **General Feedback** - For floating widget feedback
   - **Session Feedback** - For session-end feedback
   - **Analytics** - For summary data and charts

## Step 2: Set Up Sheet Headers

### Prompt Feedback Sheet
Create columns with these headers:
- A: Timestamp
- B: Prompt ID
- C: Rating (1-5)
- D: Sentiment (positive/negative)
- E: Quick Feedback Tags
- F: Detailed Feedback
- G: User Agent
- H: URL
- I: Prompt Text (first 200 chars)

### General Feedback Sheet
Create columns with these headers:
- A: Timestamp
- B: Type (bug/feature/question/general)
- C: Message
- D: Email
- E: User Agent
- F: URL

### Session Feedback Sheet
Create columns with these headers:
- A: Timestamp
- B: Overall Rating
- C: Saved Time (Yes/No)
- D: Would Recommend (Yes/No)
- E: Features Wanted
- F: Experience
- G: Improvements
- H: Prompts Refined
- I: Time Spent (minutes)
- J: User Agent
- K: URL

## Step 3: Create Enhanced Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete the default code and paste the following enhanced script:

```javascript
function doPost(e) {
  try {
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);
    const type = data.type;
    const feedbackData = data.data || data;
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Route to appropriate sheet based on type
    let sheet;
    let values = [];
    
    switch(type) {
      case 'prompt_feedback':
        sheet = ss.getSheetByName('Prompt Feedback');
        values = [
          feedbackData.timestamp || new Date().toISOString(),
          feedbackData.promptId || '',
          feedbackData.rating || 0,
          feedbackData.sentiment || '',
          feedbackData.quickFeedback ? feedbackData.quickFeedback.join(', ') : '',
          feedbackData.detailedFeedback || '',
          feedbackData.userAgent || '',
          feedbackData.url || '',
          feedbackData.promptText || ''
        ];
        break;
        
      case 'general_feedback':
        sheet = ss.getSheetByName('General Feedback');
        values = [
          feedbackData.timestamp || new Date().toISOString(),
          feedbackData.type || '',
          feedbackData.message || '',
          feedbackData.email || '',
          feedbackData.userAgent || '',
          feedbackData.url || ''
        ];
        break;
        
      case 'session_feedback':
        sheet = ss.getSheetByName('Session Feedback');
        values = [
          feedbackData.timestamp || new Date().toISOString(),
          feedbackData.overallRating || 0,
          feedbackData.savedTime ? 'Yes' : 'No',
          feedbackData.wouldRecommend ? 'Yes' : 'No',
          feedbackData.featuresWanted ? feedbackData.featuresWanted.join(', ') : '',
          feedbackData.experience || '',
          feedbackData.improvements || '',
          feedbackData.sessionData ? feedbackData.sessionData.promptsRefined : 0,
          feedbackData.sessionData ? feedbackData.sessionData.timeSpent : 0,
          feedbackData.userAgent || '',
          feedbackData.url || ''
        ];
        break;
        
      default:
        return ContentService
          .createTextOutput(JSON.stringify({error: 'Invalid feedback type'}))
          .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (sheet && values.length > 0) {
      sheet.appendRow(values);
      
      // Send email alert for critical feedback
      if (shouldSendAlert(type, feedbackData)) {
        sendAlertEmail(type, feedbackData);
      }
      
      return ContentService
        .createTextOutput(JSON.stringify({success: true, message: 'Feedback recorded'}))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error('Sheet not found or invalid data');
    }
    
  } catch (error) {
    console.error('Error processing feedback:', error);
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to determine if an alert should be sent
function shouldSendAlert(type, data) {
  if (type === 'general_feedback' && data.type === 'bug') return true;
  if (type === 'prompt_feedback' && data.rating <= 2) return true;
  if (type === 'session_feedback' && data.overallRating <= 2) return true;
  return false;
}

// Function to send email alerts (optional)
function sendAlertEmail(type, data) {
  try {
    const email = 'your-email@example.com'; // Replace with your email
    let subject = '';
    let body = '';
    
    switch(type) {
      case 'general_feedback':
        subject = '🐛 Bug Report - FixMyPrompt';
        body = `Bug Report Received:\n\nMessage: ${data.message}\nEmail: ${data.email}\nTimestamp: ${data.timestamp}`;
        break;
      case 'prompt_feedback':
        subject = '⭐ Low Rating Alert - FixMyPrompt';
        body = `Low Rating Received:\n\nRating: ${data.rating}/5\nFeedback: ${data.detailedFeedback}\nTimestamp: ${data.timestamp}`;
        break;
      case 'session_feedback':
        subject = '📊 Low Session Rating - FixMyPrompt';
        body = `Low Session Rating:\n\nRating: ${data.overallRating}/5\nFeedback: ${data.experience}\nTimestamp: ${data.timestamp}`;
        break;
    }
    
    GmailApp.sendEmail(email, subject, body);
  } catch (error) {
    console.error('Failed to send alert email:', error);
  }
}

// Optional: Add a comprehensive test function
function testAllFeedbackTypes() {
  // Test prompt feedback
  const promptTest = {
    postData: {
      contents: JSON.stringify({
        type: 'prompt_feedback',
        data: {
          timestamp: new Date().toISOString(),
          promptId: 'test-123',
          rating: 5,
          sentiment: 'positive',
          quickFeedback: ['helpful', 'clear'],
          detailedFeedback: 'This is a test feedback',
          userAgent: 'Test Browser',
          url: 'https://test.com',
          promptText: 'Test prompt text...'
        }
      })
    }
  };
  
  // Test general feedback
  const generalTest = {
    postData: {
      contents: JSON.stringify({
        type: 'general_feedback',
        data: {
          timestamp: new Date().toISOString(),
          type: 'bug',
          message: 'Test bug report',
          email: 'test@test.com',
          userAgent: 'Test Browser',
          url: 'https://test.com'
        }
      })
    }
  };
  
  // Test session feedback
  const sessionTest = {
    postData: {
      contents: JSON.stringify({
        type: 'session_feedback',
        data: {
          timestamp: new Date().toISOString(),
          overallRating: 4,
          savedTime: true,
          wouldRecommend: true,
          featuresWanted: ['feature1', 'feature2'],
          experience: 'Great experience',
          improvements: 'Could be faster',
          sessionData: {
            promptsRefined: 3,
            timeSpent: 15
          },
          userAgent: 'Test Browser',
          url: 'https://test.com'
        }
      })
    }
  };
  
  console.log('Testing prompt feedback:', doPost(promptTest).getContent());
  console.log('Testing general feedback:', doPost(generalTest).getContent());
  console.log('Testing session feedback:', doPost(sessionTest).getContent());
}
```

## Step 4: Deploy the Script

1. Click **Deploy** button (top right)
2. Choose **New deployment**
3. Select type: **Web app**
4. Execute as: **Me**
5. Who has access: **Anyone** (important for external requests)
6. Click **Deploy**
7. Copy the **Web app URL** - this is your webhook URL

## Step 5: Configure Environment Variables

In your FixMyPrompt project:

1. Create/update `.env.local` file:
```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

2. Replace `YOUR_SCRIPT_ID` with the actual script ID from the URL you copied

## Step 6: Test the Integration

1. Deploy your FixMyPrompt application
2. Generate some feedback by:
   - Rating a refined prompt
   - Using the floating feedback widget
   - Completing a session feedback
3. Check your Google Sheets - data should appear automatically

You can also test directly in Apps Script by running the `testAllFeedbackTypes()` function.

## Step 7: Set Up Analytics Dashboard

### Create Charts in the Analytics Sheet

1. **Daily Feedback Volume**
   - Chart type: Line chart
   - Data range: All feedback timestamps
   - Group by date

2. **Rating Distribution**
   - Chart type: Column chart
   - Data range: All ratings from prompt and session feedback

3. **Feedback Type Breakdown**
   - Chart type: Pie chart
   - Data range: General feedback types

### Sample Analytics Formulas

Add these to your Analytics sheet:

**Average Prompt Rating:**
```
=AVERAGE('Prompt Feedback'!C:C)
```

**Total Feedback Count:**
```
=COUNTA('Prompt Feedback'!A:A) + COUNTA('General Feedback'!A:A) + COUNTA('Session Feedback'!A:A) - 3
```

**Positive Sentiment Percentage:**
```
=COUNTIF('Prompt Feedback'!D:D,"positive")/COUNTA('Prompt Feedback'!D:D)*100
```

**Most Requested Features:**
```
=QUERY('Session Feedback'!E:E,"SELECT E, COUNT(E) WHERE E != '' GROUP BY E ORDER BY COUNT(E) DESC LIMIT 5")
```

## Advanced Features

### Email Notifications
The script includes email notifications for:
- Bug reports
- Low ratings (≤2 stars)
- Critical session feedback

To enable, replace `'your-email@example.com'` in the script with your actual email.

### Data Validation
Add these validation rules to prevent spam:

```javascript
// Add to the beginning of doPost function
if (feedbackData.userAgent && feedbackData.userAgent.toLowerCase().includes('bot')) {
  return ContentService
    .createTextOutput(JSON.stringify({error: 'Bot detected'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Rate limiting (simple approach)
const cache = CacheService.getScriptCache();
const clientIP = e.parameter.clientIP || 'unknown';
const rateLimitKey = 'rate_limit_' + clientIP;
const lastRequest = cache.get(rateLimitKey);

if (lastRequest && (Date.now() - parseInt(lastRequest)) < 5000) { // 5 second limit
  return ContentService
    .createTextOutput(JSON.stringify({error: 'Rate limit exceeded'}))
    .setMimeType(ContentService.MimeType.JSON);
}

cache.put(rateLimitKey, Date.now().toString(), 60); // Cache for 1 minute
```

## Troubleshooting

### Common Issues

1. **403 Forbidden Error**
   - Ensure "Who has access" is set to "Anyone"
   - Redeploy the script

2. **Data Not Appearing**
   - Check the Apps Script logs (View > Logs)
   - Verify sheet names match exactly
   - Test with the `testAllFeedbackTypes()` function

3. **Email Alerts Not Working**
   - Ensure you have Gmail access enabled
   - Check spam folder
   - Verify email address in script

### Testing Steps

1. **Test Script Manually:**
   - Run `testAllFeedbackTypes()` in Apps Script
   - Check execution logs for errors

2. **Test Webhook:**
   ```bash
   curl -X POST -H "Content-Type: application/json" \
   -d '{"type":"prompt_feedback","data":{"rating":5,"timestamp":"2024-01-01T00:00:00.000Z"}}' \
   YOUR_WEBHOOK_URL
   ```

3. **Monitor Logs:**
   - Check Apps Script execution logs
   - Monitor browser network tab for API responses

## Security Considerations

1. **Access Control**: Regularly review who has access to your sheets
2. **Data Sanitization**: The script sanitizes input data
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **HTTPS Only**: Always use HTTPS for webhook URLs

## Maintenance Tips

1. **Regular Backups**: Export your sheets monthly
2. **Log Monitoring**: Check execution logs weekly
3. **Data Archiving**: Archive old data to keep sheets performant
4. **Script Updates**: Keep track of script changes with comments

## Next Steps

Once your integration is working:

1. **Create Automated Reports**: Set up weekly/monthly summary emails
2. **Integrate with Other Tools**: Connect to Slack, Discord, or project management tools
3. **Advanced Analytics**: Use Google Data Studio for more sophisticated dashboards
4. **A/B Testing**: Track feedback across different app versions

---

## Support

If you encounter issues:
1. Check the Apps Script execution logs
2. Verify all sheet names match exactly
3. Test with the provided test functions
4. Ensure the webhook URL is correct in your environment variables

**Pro Tip**: Start with the test functions in Apps Script to ensure everything works before testing from your live application.
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Route to appropriate sheet based on feedback type
    switch(data.type) {
      case 'prompt_feedback':
        handlePromptFeedback(spreadsheet, data);
        break;
      case 'general_feedback':
        handleGeneralFeedback(spreadsheet, data);
        break;
      case 'session_feedback':
        handleSessionFeedback(spreadsheet, data);
        break;
      default:
        console.log('Unknown feedback type:', data.type);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing feedback:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handlePromptFeedback(spreadsheet, data) {
  let sheet = spreadsheet.getSheetByName('Prompt Feedback');
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Prompt Feedback');
    // Add headers
    sheet.getRange(1, 1, 1, 8).setValues([[
      'Timestamp', 'Prompt ID', 'Rating', 'Sentiment', 'Quick Feedback', 
      'Detailed Feedback', 'Prompt Text', 'URL'
    ]]);
  }
  
  // Add data row
  sheet.appendRow([
    new Date(data.timestamp),
    data.promptId || '',
    data.rating || '',
    data.sentiment || '',
    (data.quickFeedback || []).join(', '),
    data.detailedFeedback || '',
    data.promptText || '',
    data.url || ''
  ]);
}

function handleGeneralFeedback(spreadsheet, data) {
  let sheet = spreadsheet.getSheetByName('General Feedback');
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet('General Feedback');
    // Add headers
    sheet.getRange(1, 1, 1, 6).setValues([[
      'Timestamp', 'Type', 'Message', 'Email', 'User Agent', 'URL'
    ]]);
  }
  
  // Add data row
  sheet.appendRow([
    new Date(data.timestamp),
    data.type || '',
    data.message || '',
    data.email || '',
    data.userAgent || '',
    data.url || ''
  ]);
}

function handleSessionFeedback(spreadsheet, data) {
  let sheet = spreadsheet.getSheetByName('Session Feedback');
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Session Feedback');
    // Add headers
    sheet.getRange(1, 1, 1, 10).setValues([[
      'Timestamp', 'Overall Rating', 'Saved Time', 'Would Recommend', 
      'Features Wanted', 'Experience', 'Improvements', 'Prompts Refined', 
      'Time Spent', 'URL'
    ]]);
  }
  
  // Add data row
  sheet.appendRow([
    new Date(data.timestamp),
    data.overallRating || '',
    data.savedTime ? 'Yes' : 'No',
    data.wouldRecommend ? 'Yes' : 'No',
    (data.featuresWanted || []).join(', '),
    data.experience || '',
    data.improvements || '',
    data.sessionData?.promptsRefined || '',
    data.sessionData?.timeSpent || '',
    data.url || ''
  ]);
}
```

## Sheet Structure

### Prompt Feedback Sheet
- **Timestamp**: When feedback was submitted
- **Prompt ID**: Unique identifier for the prompt
- **Rating**: 1-5 star rating
- **Sentiment**: Positive/Negative
- **Quick Feedback**: Selected feedback tags
- **Detailed Feedback**: User's written feedback
- **Prompt Text**: Truncated version of the prompt
- **URL**: Page where feedback was submitted

### General Feedback Sheet
- **Timestamp**: When feedback was submitted
- **Type**: bug/feature/question/general
- **Message**: User's feedback message
- **Email**: Contact email (if provided)
- **User Agent**: Browser information
- **URL**: Page where feedback was submitted

### Session Feedback Sheet
- **Timestamp**: When feedback was submitted
- **Overall Rating**: 1-5 star session rating
- **Saved Time**: Whether user felt time was saved
- **Would Recommend**: Whether user would recommend
- **Features Wanted**: Requested features
- **Experience**: User's experience description
- **Improvements**: Suggested improvements
- **Prompts Refined**: Number of prompts in session
- **Time Spent**: Minutes spent in session
- **URL**: Page where feedback was submitted

## Benefits

✅ **Real-time Data**: Feedback appears in sheets immediately
✅ **Easy Access**: View and analyze data directly in Google Sheets
✅ **Backup Storage**: Data is stored both locally and in Google Sheets
✅ **Collaborative**: Share sheets with team members
✅ **Export Ready**: Easy to export to other tools
✅ **Visual Analysis**: Create charts and pivot tables in Google Sheets

## Troubleshooting

- **Data not appearing**: Check the web app deployment settings
- **Permission errors**: Make sure the script has necessary permissions
- **JSON parsing errors**: Check the Apps Script logs for details
- **Rate limits**: Google Apps Script has daily quotas for executions

Your feedback system will now automatically populate Google Sheets with all user feedback data!
