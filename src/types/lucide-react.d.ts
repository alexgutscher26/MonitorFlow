declare module 'lucide-react' {
  import { SVGProps, ForwardRefExoticComponent, RefAttributes } from 'react';

  export interface LucideProps extends Partial<SVGProps<SVGSVGElement>> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;

  // Export all icons from lucide-react
  export const CheckCircle: LucideIcon;
  export const XCircle: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Clock: LucideIcon;
  export const Cog: LucideIcon;
  export const Gift: LucideIcon;
  export const Headphones: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const Inbox: LucideIcon;
  export const Menu: LucideIcon;
  export const Mic: LucideIcon;
  export const Phone: LucideIcon;
  export const Pin: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Search: LucideIcon;
  export const Smile: LucideIcon;
  export const Sticker: LucideIcon;
  export const UserCircle: LucideIcon;
  export const Video: LucideIcon;
  // Add any other icons you're using in your project
}