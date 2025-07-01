import { NextRequest, NextResponse } from 'next/server';

// Google Sheets configuration
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // If Google Sheets webhook URL is not configured, just return success
    if (!GOOGLE_SHEETS_URL) {
      console.log('Google Sheets webhook not configured, feedback stored locally only');
      return NextResponse.json({ success: true, message: 'Feedback received (local storage only)' });
    }

    // Prepare data for Google Sheets
    const sheetData = {
      timestamp: data.timestamp || new Date().toISOString(),
      type: type,
      ...data,
    };

    // Send to Google Sheets via webhook
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetData),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback sent to Google Sheets successfully' 
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
