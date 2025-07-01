// Utility script to export feedback data from localStorage
// Run this in browser console on your site to export feedback data

function exportFeedbackData() {
  const data = {
    promptFeedback: JSON.parse(localStorage.getItem('fixmyprompt_feedback') || '[]'),
    generalFeedback: JSON.parse(localStorage.getItem('fixmyprompt_general_feedback') || '[]'),
    sessionFeedback: JSON.parse(localStorage.getItem('fixmyprompt_session_feedback') || '[]'),
    exportedAt: new Date().toISOString(),
    totalEntries: 0
  };

  data.totalEntries = data.promptFeedback.length + data.generalFeedback.length + data.sessionFeedback.length;

  console.log('=== FIXMYPROMPT FEEDBACK DATA ===');
  console.log('Total entries:', data.totalEntries);
  console.log('Prompt feedback:', data.promptFeedback.length);
  console.log('General feedback:', data.generalFeedback.length);
  console.log('Session feedback:', data.sessionFeedback.length);
  console.log('\n=== RAW DATA ===');
  console.log(JSON.stringify(data, null, 2));

  // Create downloadable file
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fixmyprompt-feedback-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return data;
}

// To use: copy this function into browser console and run exportFeedbackData()
