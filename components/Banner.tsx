interface BannerProps {
  text: string;
}

export function Banner({ text }: BannerProps) {
  return (
    <div className="bg-govt-red text-white py-2">
      <div className="container mx-auto px-4">
        <p className="text-center font-bold uppercase tracking-wider text-sm md:text-base">
          {text}
        </p>
      </div>
    </div>
  );
}