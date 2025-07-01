import { NextRequest, NextResponse } from 'next/server';

// Google Sheets configuration
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    console.log('Feedback API called:', { type, dataKeys: Object.keys(data || {}) });

    // If Google Sheets webhook URL is not configured, just return success
    if (!GOOGLE_SHEETS_URL) {
      console.log('Google Sheets webhook not configured, feedback stored locally only');
      return NextResponse.json({ success: true, message: 'Feedback received (local storage only)' });
    }

    // Prepare data for Google Sheets - match the expected structure
    const sheetData = {
      type: type,
      data: {
        timestamp: data.timestamp || new Date().toISOString(),
        ...data,
      }
    };

    console.log('Sending to Google Sheets:', JSON.stringify(sheetData, null, 2));

    // Send to Google Sheets via webhook
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetData),
    });

    const responseText = await response.text();
    console.log('Google Sheets response:', response.status, responseText);

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} - ${responseText}`);
    }

    // Try to parse the response
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.log('Response is not JSON, treating as success');
      responseData = { success: true };
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback sent to Google Sheets successfully',
      sheetsResponse: responseData
    });

  } catch (error) {
    console.error('Error sending feedback to Google Sheets:', error);
    
    // Return success anyway - feedback is still stored locally
    return NextResponse.json({ 
      success: true, 
      message: 'Feedback received (Google Sheets sync failed, stored locally)',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
