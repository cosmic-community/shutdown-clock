import Link from 'next/link'

interface FooterProps {
  text?: string;
}

export function Footer({ text }: FooterProps) {
  const footerText = text || 'Not affiliated with any government agency. But maybe we should be.';
  
  return (
    <footer className="bg-govt-gray text-white py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm italic">
          {footerText}
        </p>
        
        {/* Admin Button */}
        <div className="mt-4">
          <Link 
            href="/analytics"
            className="inline-block text-xs text-gray-400 hover:text-white transition-colors duration-200 opacity-50 hover:opacity-100"
          >
            Analytics
          </Link>
        </div>
      </div>
    </footer>
  );
}