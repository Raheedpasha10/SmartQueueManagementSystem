import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
        <Icon className="h-10 w-10 text-blue-600" />
      </div>
      
      <h3 className="mt-6 text-2xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-md text-base text-gray-600">{description}</p>
      
      {children}
      
      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-8">
          {actionHref ? (
            <Link href={actionHref}>
              <Button size="lg" className="shadow-md">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button size="lg" onClick={onAction} className="shadow-md">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

