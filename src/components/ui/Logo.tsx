import { cn } from "../../lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img src="/logo.png" alt="CivicPath Logo" className="w-full h-full object-contain" />
    </div>
  );
};

