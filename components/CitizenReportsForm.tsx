'use client'

import { useState } from 'react'
import { submitCitizenReport } from '@/lib/cosmic'
import { CitizenReportFormData } from '@/types'

export function CitizenReportsForm() {
  const [formData, setFormData] = useState<CitizenReportFormData>({
    name: '',
    location: '',
    survivalTactics: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
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
      await submitCitizenReport(formData);
      
      setMessage('Thank you for your report! It has been submitted for review and will appear once approved.');
      setFormData({ name: '', location: '', survivalTactics: '' });
      setCharactersLeft(200);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit report';
      setMessage(errorMessage);
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
        <div className={`p-4 rounded-md ${message.includes('Thank you') 
          ? 'bg-green-50 text-green-800 border border-green-200' 
          : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </form>
  );
}