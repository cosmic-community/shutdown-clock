'use client'

import { useState } from 'react'
import { CitizenReportFormData } from '@/types'

export function CitizenReportsForm() {
  const [formData, setFormData] = useState<CitizenReportFormData>({
    name: '',
    location: '',
    survivalTactics: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [charactersLeft, setCharactersLeft] = useState(200);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'survivalTactics') {
      if (value.length <= 200) {
        setFormData(prev => ({ ...prev, [name]: value }));
        setCharactersLeft(200 - value.length);
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Validate form data
      if (!formData.name.trim() || !formData.location.trim() || !formData.survivalTactics.trim()) {
        throw new Error('All fields are required');
      }

      if (formData.survivalTactics.length > 200) {
        throw new Error('Survival tactics must be 200 characters or less');
      }

      // Submit the report via API route
      const response = await fetch('/api/submit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit report');
      }
      
      // Show success message
      setMessage('Thank you for your report! It has been submitted for review and will appear once approved.');
      setMessageType('success');
      
      // Reset form
      setFormData({ name: '', location: '', survivalTactics: '' });
      setCharactersLeft(200);
      
    } catch (error) {
      console.error('Form submission error:', error);
      let errorMessage = 'Failed to submit report. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-govt-gray mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="govt-input"
            required
            disabled={isSubmitting}
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-govt-gray mb-2">
            Location (City, State) *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="govt-input"
            placeholder="e.g., Denver, CO"
            required
            disabled={isSubmitting}
            maxLength={100}
          />
        </div>
      </div>

      <div>
        <label htmlFor="survivalTactics" className="block text-sm font-medium text-govt-gray mb-2">
          What are you doing while the government is closed? *
        </label>
        <textarea
          id="survivalTactics"
          name="survivalTactics"
          value={formData.survivalTactics}
          onChange={handleInputChange}
          rows={4}
          className="govt-textarea"
          placeholder="Share your shutdown survival tactics..."
          required
          disabled={isSubmitting}
          maxLength={200}
        />
        <div className="text-right mt-1">
          <span className={`text-sm ${charactersLeft < 20 ? 'text-govt-red' : 'text-gray-500'}`}>
            {charactersLeft} characters remaining
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting || !formData.name.trim() || !formData.location.trim() || !formData.survivalTactics.trim()}
          className="govt-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${messageType === 'success' 
          ? 'bg-green-50 text-green-800 border border-green-200' 
          : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {messageType === 'success' ? (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}