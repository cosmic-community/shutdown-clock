# Shutdown Clock

![App Preview](https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&h=300&fit=crop&auto=format)

A satirical government-style website that tracks the duration of a government shutdown with a live countdown timer. Features official government aesthetics with subtle humor, real-time countdown, and interactive citizen engagement.

## ✨ Features

- **Live Countdown Timer** - Real-time tracking of days, hours, minutes, and seconds since shutdown start
- **Interactive Citizen Reports** - User submission form for shutdown survival tactics
- **Social Media Sharing** - Direct Twitter and Facebook sharing capabilities
- **Dynamic Content Management** - All text and settings managed through Cosmic CMS
- **Government Design Aesthetic** - Professional styling with subtle humorous elements
- **Mobile Responsive** - Fully optimized for all device sizes
- **Content Moderation** - Approval system for citizen report submissions

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68dc43cd71f3904a2a941195&clone_repository=68dc44ee71f3904a2a9411a4)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Build a simple, single-page website called "Shutdown Clock". The design should feel clean and official, similar to a government site, but with small humorous undertones that make visitors smile.

Page requirements:
	•	A large headline at the top: "The Government Has Been Shut Down For:"
	•	A live counter that shows the exact number of days, hours, minutes, and seconds since the shutdown start date (set this with an environment variable so it can be updated easily).
	•	A bold, serious-looking subtitle under the counter: "This information is provided for public awareness."
	•	Add a thin red banner across the top that says "OFFICIAL NOTICE" in all caps.

Engagement section:
	•	Include a form titled "Report Your Shutdown Survival Tactics" with fields for:
	•	Name
	•	Location (City, State)
	•	What you are doing while the government is closed (text area, max 200 characters)
	•	Submissions should be displayed below the form in a list titled "Citizen Reports" with the name, location, and response.
	•	Add a small disclaimer under the form: "This is not an actual government service. But your input may provide comic relief."

Styling:
	•	Use a professional, government-style serif font for headings and a clean sans-serif for body text.
	•	Stick to a palette of dark blue, white, and red accents.
	•	Make the layout responsive and mobile-friendly.

Extra touches:
	•	Add a share button to post the counter link on X (Twitter) and Facebook.
	•	Include a small footer that says: "Not affiliated with any government agency. But maybe we should be.""

### Code Generation Prompt

> Based on the content model I created for "Build a simple, single-page website called "Shutdown Clock". The design should feel clean and official, similar to a government site, but with small humorous undertones that make visitors smile. [content details...], now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic CMS** - Headless content management
- **React** - UI component library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- A Cosmic account and bucket

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your environment variables:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Cosmic SDK Examples

### Fetching Site Settings
```typescript
const response = await cosmic.objects.findOne({
  type: 'site-settings',
  slug: 'shutdown-clock-settings'
}).depth(1);

const settings = response.object as SiteSettings;
```

### Creating Citizen Reports
```typescript
const response = await cosmic.objects.insertOne({
  type: 'citizen-reports',
  title: `${formData.name}'s Survival Strategy`,
  metadata: {
    name: formData.name,
    location: formData.location,
    survival_tactics: formData.survivalTactics,
    approved: false
  }
});
```

## 🎯 Cosmic CMS Integration

This application uses two main content types:

### Site Settings
- **Shutdown Start Date**: Controls the countdown timer
- **Main Headline**: Primary page heading
- **Banner Text**: Top banner notification
- **Form Title**: Citizen reports form title
- **Disclaimers**: Various disclaimer texts

### Citizen Reports
- **Name**: Contributor's name
- **Location**: City, State format
- **Survival Tactics**: User's shutdown activities (200 char limit)
- **Approved**: Moderation flag for public display

All content is dynamically fetched from your Cosmic bucket, allowing real-time updates without code changes.

## 🚀 Deployment

### Deploy to Vercel

1. Connect your repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set the environment variables in Netlify dashboard
3. Deploy

For production, make sure to set all environment variables in your hosting platform's dashboard.

<!-- README_END -->