'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, Star, ThumbsUp, MessageSquare } from 'lucide-react';

// This component is for admin/developer use to view collected feedback
export function FeedbackDashboard() {
  const [promptFeedback, setPromptFeedback] = useState<any[]>([]);
  const [generalFeedback, setGeneralFeedback] = useState<any[]>([]);
  const [sessionFeedback, setSessionFeedback] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'prompt' | 'general' | 'session'>('prompt');

  useEffect(() => {
    // Load feedback from localStorage
    const loadFeedback = () => {
      const prompt = JSON.parse(localStorage.getItem('fixmyprompt_feedback') || '[]');
      const general = JSON.parse(localStorage.getItem('fixmyprompt_general_feedback') || '[]');
      const session = JSON.parse(localStorage.getItem('fixmyprompt_session_feedback') || '[]');
      
      setPromptFeedback(prompt);
      setGeneralFeedback(general);
      setSessionFeedback(session);
    };

    loadFeedback();
  }, []);

  const exportData = () => {
    const allData = {
      promptFeedback,
      generalFeedback,
      sessionFeedback,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixmyprompt-feedback-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all feedback data? This cannot be undone.')) {
      localStorage.removeItem('fixmyprompt_feedback');
      localStorage.removeItem('fixmyprompt_general_feedback');
      localStorage.removeItem('fixmyprompt_session_feedback');
      setPromptFeedback([]);
      setGeneralFeedback([]);
      setSessionFeedback([]);
    }
  };

  const getAverageRating = (feedbacks: any[]) => {
    const ratings = feedbacks.filter(f => f.rating > 0).map(f => f.rating);
    return ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';
  };

  const getOverallRating = (feedbacks: any[]) => {
    const ratings = feedbacks.filter(f => f.overallRating > 0).map(f => f.overallRating);
    return ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6" />
              <span>Feedback Dashboard</span>
            </h1>
            <p className="text-gray-600">User feedback analytics for FixMyPrompt</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={clearData} variant="destructive" size="sm">
              Clear Data
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Avg Prompt Rating</p>
                  <p className="text-xl font-semibold">{getAverageRating(promptFeedback)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Session Rating</p>
                  <p className="text-xl font-semibold">{getOverallRating(sessionFeedback)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Feedback</p>
                  <p className="text-xl font-semibold">
                    {promptFeedback.length + generalFeedback.length + sessionFeedback.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-xl font-semibold">{sessionFeedback.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
          {[
            { id: 'prompt', label: 'Prompt Feedback', count: promptFeedback.length },
            { id: 'general', label: 'General Feedback', count: generalFeedback.length },
            { id: 'session', label: 'Session Feedback', count: sessionFeedback.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'prompt' && (
            <div className="grid grid-cols-1 gap-4">
              {promptFeedback.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No prompt feedback collected yet.
                  </CardContent>
                </Card>
              ) : (
                promptFeedback.map((feedback, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(feedback.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {feedback.sentiment && (
                          <Badge 
                            className={
                              feedback.sentiment === 'positive' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {feedback.sentiment}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {feedback.quickFeedback.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Quick Feedback:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {feedback.quickFeedback.map((item: string) => (
                                <Badge key={item} variant="outline" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {feedback.improvements.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Improvements:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {feedback.improvements.map((item: string) => (
                                <Badge key={item} variant="outline" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {feedback.detailedFeedback && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Detailed Feedback:</p>
                            <p className="text-sm text-gray-600 mt-1">{feedback.detailedFeedback}</p>
                          </div>
                        )}

                        <div className="text-xs text-gray-400 mt-2">
                          Prompt: {feedback.promptText}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'general' && (
            <div className="grid grid-cols-1 gap-4">
              {generalFeedback.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No general feedback collected yet.
                  </CardContent>
                </Card>
              ) : (
                generalFeedback.map((feedback, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge 
                          className={
                            feedback.type === 'bug' ? 'bg-red-100 text-red-800' :
                            feedback.type === 'feature' ? 'bg-yellow-100 text-yellow-800' :
                            feedback.type === 'question' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }
                        >
                          {feedback.type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(feedback.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-2">{feedback.message}</p>
                      {feedback.email && (
                        <p className="text-xs text-gray-500">Email: {feedback.email}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'session' && (
            <div className="grid grid-cols-1 gap-4">
              {sessionFeedback.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No session feedback collected yet.
                  </CardContent>
                </Card>
              ) : (
                sessionFeedback.map((feedback, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= feedback.overallRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {feedback.sessionData.promptsRefined} prompts, {feedback.sessionData.timeSpent}m
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(feedback.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex space-x-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            feedback.savedTime ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            Saved time: {feedback.savedTime ? 'Yes' : 'No'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            feedback.wouldRecommend ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            Would recommend: {feedback.wouldRecommend ? 'Yes' : 'No'}
                          </span>
                        </div>

                        {feedback.featuresWanted.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Wanted Features:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {feedback.featuresWanted.map((feature: string) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {feedback.experience && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Experience:</p>
                            <p className="text-sm text-gray-600 mt-1">{feedback.experience}</p>
                          </div>
                        )}

                        {feedback.improvements && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Improvements:</p>
                            <p className="text-sm text-gray-600 mt-1">{feedback.improvements}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
