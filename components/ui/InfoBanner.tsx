import { AlertCircle, CheckCircle, Info, Shield } from "lucide-react";

type Variant = "info" | "success" | "warning" | "security";

const VARIANT_STYLES: Record<Variant, { bg: string; border: string; icon: string; Icon: typeof Info }> = {
  info: {
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    icon: "text-blue-500",
    Icon: Info,
  },
  success: {
    bg: "bg-green-500/5",
    border: "border-green-500/20",
    icon: "text-green-500",
    Icon: CheckCircle,
  },
  warning: {
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    icon: "text-amber-500",
    Icon: AlertCircle,
  },
  security: {
    bg: "bg-purple-500/5",
    border: "border-purple-500/20",
    icon: "text-purple-500",
    Icon: Shield,
  },
};

export default function InfoBanner({
  variant = "info",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
}) {
  const { bg, border, icon, Icon } = VARIANT_STYLES[variant];

  return (
    <div className={`flex gap-3 rounded-xl border ${border} ${bg} p-4`}>
      <Icon size={18} className={`mt-0.5 shrink-0 ${icon}`} />
      <div className="text-sm leading-relaxed text-(--foreground)">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}
