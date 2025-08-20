'use client';

import { useState } from 'react';
import { useTopicCheck } from '../hooks/useNuanceData';
import { LoadingSpinner } from './LoadingSpinner';

export function TopicAnalyzer() {
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('bittensor');
  const [shouldAnalyze, setShouldAnalyze] = useState(false);

  const { data: analysis, isLoading, error } = useTopicCheck(content, topic, shouldAnalyze);

  const handleAnalyze = () => {
    if (content.trim() && topic.trim()) {
      setShouldAnalyze(true);
    }
  };

  const resetAnalysis = () => {
    setShouldAnalyze(false);
    setContent('');
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Topic Relevance Analyzer</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content to Analyze
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content to check topic relevance..."
            className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Topic
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <option value="bittensor">Bittensor</option>
            <option value="ai">Artificial Intelligence</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="blockchain">Blockchain</option>
            <option value="tech">Technology</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAnalyze}
            disabled={!content.trim() || !topic.trim() || isLoading}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Topic Relevance'}
          </button>
          
          {shouldAnalyze && (
            <button
              onClick={resetAnalysis}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner />
            <span className="ml-2 text-gray-400">Analyzing content...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400">
              Failed to analyze content. Rate limit may be exceeded (2 requests per minute).
            </p>
          </div>
        )}

        {analysis && !isLoading && (
          <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-300 mb-2">Analysis Results</h4>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>⚠️ Rate limited to 2 requests per minute</p>
      </div>
    </div>
  );
}