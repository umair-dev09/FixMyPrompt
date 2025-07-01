# Quick Fix Guide - Google Apps Script Issues

## 🚨 URGENT FIX: Script Error Resolution

You're experiencing this error: `Cannot read properties of undefined (reading 'postData')` because you're running the script manually without proper test structure.

### ✅ **IMMEDIATE SOLUTION:**

1. **Replace your Google Apps Script code** with this corrected version:

```javascript
function doPost(e) {
  try {
    // Handle both webhook calls and manual testing
    let data;
    if (e && e.postData && e.postData.contents) {
      // This is a real webhook call
      data = JSON.parse(e.postData.contents);
    } else {
      // This is likely a manual test or invalid call
      throw new Error('Invalid request: No postData found. Use testAllFeedbackTypes() for testing.');
    }
    
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
        if (!sheet) {
          throw new Error('Sheet "Prompt Feedback" not found. Please create it first.');
        }
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
        if (!sheet) {
          throw new Error('Sheet "General Feedback" not found. Please create it first.');
        }
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
        if (!sheet) {
          throw new Error('Sheet "Session Feedback" not found. Please create it first.');
        }
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
          .createTextOutput(JSON.stringify({error: 'Invalid feedback type: ' + type}))
          .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (sheet && values.length > 0) {
      sheet.appendRow(values);
      console.log('Feedback recorded successfully:', type, values);
      
      return ContentService
        .createTextOutput(JSON.stringify({success: true, message: 'Feedback recorded successfully'}))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error('Sheet not found or invalid data');
    }
    
  } catch (error) {
    console.error('Error processing feedback:', error);
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString(), timestamp: new Date().toISOString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// CORRECTED: Test function that works properly
function testGeneralFeedback() {
  console.log('Testing General Feedback...');
  
  const test = {
    postData: {
      contents: JSON.stringify({
        type: 'general_feedback',
        data: {
          timestamp: new Date().toISOString(),
          type: 'question',
          message: 'This is a test question about FixMyPrompt',
          email: 'test@example.com',
          userAgent: 'Test Browser',
          url: 'https://fixmyprompt.com'
        }
      })
    }
  };
  
  const result = doPost(test);
  console.log('Result:', result.getContent());
  return result;
}

function testAllFeedbackTypes() {
  console.log('=== Testing All Feedback Types ===');
  
  // Test general feedback (the one you're having issues with)
  console.log('\n1. Testing General Feedback...');
  testGeneralFeedback();
  
  // Test prompt feedback
  console.log('\n2. Testing Prompt Feedback...');
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
          detailedFeedback: 'Test feedback',
          userAgent: 'Test Browser',
          url: 'https://fixmyprompt.com',
          promptText: 'Test prompt text...'
        }
      })
    }
  };
  
  const promptResult = doPost(promptTest);
  console.log('Prompt result:', promptResult.getContent());
  
  console.log('\n=== Test Complete ===');
  console.log('Check your Google Sheets to see the data!');
}
```

### 🔧 **TESTING STEPS:**

1. **Copy the corrected script** above into your Google Apps Script
2. **Save the script** (Ctrl+S)
3. **Run `testGeneralFeedback()`** function - this will test exactly what you're trying to do
4. **Check the logs** (View > Logs) for detailed output
5. **Check your Google Sheet** - you should see the test data appear

### 🐛 **DEBUGGING CHECKLIST:**

**Step 1: Test Google Apps Script**
- [ ] Copy the corrected script above
- [ ] Save the script
- [ ] Run `testGeneralFeedback()` function
- [ ] Check View > Logs for output
- [ ] Verify data appears in "General Feedback" sheet

**Step 2: Check Environment Variable**
- [ ] Verify `.env.local` has: `GOOGLE_SHEETS_WEBHOOK_URL=your_webhook_url`
- [ ] Restart your Next.js development server after adding/changing env vars
- [ ] Check the webhook URL is deployed as "Web app" with "Anyone" access

**Step 3: Test Frontend Integration**
- [ ] Open browser Developer Tools (F12)
- [ ] Go to Network tab
- [ ] Submit a general feedback from your website
- [ ] Look for `/api/feedback` request
- [ ] Check request payload and response
- [ ] If request fails, check Console tab for errors

**Step 4: Manual Webhook Test**
Run this in your terminal (replace YOUR_WEBHOOK_URL):

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "type": "general_feedback",
    "data": {
      "timestamp": "2024-01-01T00:00:00.000Z",
      "type": "question",
      "message": "Test from curl",
      "email": "test@example.com",
      "userAgent": "curl",
      "url": "https://test.com"
    }
  }' \
  YOUR_WEBHOOK_URL
```

### 🚨 **COMMON ISSUES & SOLUTIONS:**

**Issue: "Cannot read properties of undefined (reading 'postData')"**
- ✅ **Solution**: Don't run `doPost()` directly. Use `testGeneralFeedback()` instead.

**Issue: "Sheet 'General Feedback' not found"**
- ✅ **Solution**: Create a sheet tab named exactly "General Feedback" (case-sensitive)

**Issue: "Data not appearing in sheets"**
- ✅ **Check**: Sheet names are exactly correct
- ✅ **Check**: Headers are in row 1
- ✅ **Check**: Apps Script is deployed as web app
- ✅ **Check**: Access is set to "Anyone"
- ✅ **Check**: Environment variable is set correctly

**Issue: "403 Forbidden error"**
- ✅ **Solution**: Redeploy your Apps Script with "Anyone" access

**Issue: "Network request failed from frontend"**
- ✅ **Check**: Environment variable is set
- ✅ **Check**: Server is restarted after env change
- ✅ **Check**: Webhook URL is accessible

## 🚨 **ENVIRONMENT VARIABLE NOT SET ERROR**

**Error Message:** "Google Sheets webhook not configured, feedback stored locally only"

This means your `.env.local` file doesn't have the Google Apps Script URL configured.

### **Immediate Fix:**

1. **Create/Update `.env.local` file** in your project root:
```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

2. **Replace YOUR_SCRIPT_ID** with your actual Google Apps Script deployment ID

3. **Restart your development server** (this is crucial!):
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

4. **Test again** - you should now see different logs:
```
Sending to Google Sheets: {...}
Google Sheets response: 200 {...}
```

### **How to Get Your Google Apps Script URL:**

1. Go to your Google Apps Script project
2. Click **Deploy > Manage Deployments**
3. Copy the **Web app** URL
4. It should look like: `https://script.google.com/macros/s/AKfycbw1234567890/exec`

---

### 📋 **SHEET SETUP CHECKLIST:**

Make sure you have these sheets with these EXACT names:

**Sheet 1: "General Feedback"** (for your question)
Headers in row 1:
- A1: Timestamp
- B1: Type  
- C1: Message
- D1: Email
- E1: User Agent
- F1: URL

**Sheet 2: "Prompt Feedback"**
Headers in row 1:
- A1: Timestamp
- B1: Prompt ID
- C1: Rating
- D1: Sentiment
- E1: Quick Feedback Tags
- F1: Detailed Feedback
- G1: User Agent
- H1: URL
- I1: Prompt Text

**Sheet 3: "Session Feedback"**
Headers in row 1:
- A1: Timestamp
- B1: Overall Rating
- C1: Saved Time
- D1: Would Recommend
- E1: Features Wanted
- F1: Experience
- G1: Improvements
- H1: Prompts Refined
- I1: Time Spent
- J1: User Agent
- K1: URL

### 🧪 **WHY THE ERROR OCCURRED:**

- You were running `doPost()` directly, but it expects webhook data
- The test function now properly simulates a webhook call with the correct data structure
- The script now has better error handling and debugging output

### 🚀 **NEXT STEPS:**

1. **Update your script** with the code above
2. **Run `testGeneralFeedback()`** to test the question functionality
3. **Deploy your script** as a web app (if not already done)
4. **Test from your live website** - the general feedback should now work

### 📞 **Still Having Issues?**

If you still can't see data:
1. Run `testGeneralFeedback()` and share the log output
2. Check that your sheet is named exactly "General Feedback"
3. Verify the headers are in row 1 as listed above
4. Make sure you deployed the script as a web app with "Anyone" access

The corrected script should resolve both the testing error and the missing general feedback data!
