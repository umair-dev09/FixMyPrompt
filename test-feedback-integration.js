// Test script to verify Google Sheets integration
// Run this in your browser console or as a Node.js script

async function testFeedbackIntegration() {
  const baseUrl = 'http://localhost:3000'; // Change this to your actual URL
  
  console.log('🧪 Testing Feedback Integration...\n');
  
  // Test 1: General Feedback (the one you're having issues with)
  console.log('1️⃣ Testing General Feedback...');
  try {
    const generalResponse = await fetch(`${baseUrl}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'general_feedback',
        data: {
          timestamp: new Date().toISOString(),
          type: 'question',
          message: 'This is a test question from the API test',
          email: 'test@example.com',
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      })
    });
    
    const generalResult = await generalResponse.json();
    console.log('✅ General feedback response:', generalResult);
  } catch (error) {
    console.error('❌ General feedback error:', error);
  }
  
  // Test 2: Prompt Feedback
  console.log('\n2️⃣ Testing Prompt Feedback...');
  try {
    const promptResponse = await fetch(`${baseUrl}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'prompt_feedback',
        data: {
          timestamp: new Date().toISOString(),
          promptId: 'test-prompt-123',
          rating: 5,
          sentiment: 'positive',
          quickFeedback: ['helpful', 'clear'],
          detailedFeedback: 'This is a test feedback from API test',
          userAgent: navigator.userAgent,
          url: window.location.href,
          promptText: 'Test prompt for API testing...'
        }
      })
    });
    
    const promptResult = await promptResponse.json();
    console.log('✅ Prompt feedback response:', promptResult);
  } catch (error) {
    console.error('❌ Prompt feedback error:', error);
  }
  
  console.log('\n🎯 Test Complete! Check your Google Sheets for the data.');
  console.log('💡 If data doesn\'t appear, check:');
  console.log('   - Your GOOGLE_SHEETS_WEBHOOK_URL environment variable');
  console.log('   - Google Apps Script deployment settings');
  console.log('   - Sheet names and headers');
}

// Run the test
testFeedbackIntegration();
