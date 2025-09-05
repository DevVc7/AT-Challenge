import { twMerge } from "tailwind-merge";

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

export function Page({ children, className }: PageProps) {
  return (
    <div className={twMerge("flex flex-col gap-8 w-screen h-screen", className)}>{children}</div>
  );
}
