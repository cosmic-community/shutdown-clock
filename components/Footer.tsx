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
      </div>
    </footer>
  );
}