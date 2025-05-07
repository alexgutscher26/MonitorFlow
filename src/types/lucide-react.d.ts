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
  export const MoveRight: LucideIcon;
  export const MoveLeft: LucideIcon;
  export const MoveUp: LucideIcon;
  export const MoveDown: LucideIcon;
  export const Trash2: LucideIcon;
  export const ArrowUp: LucideIcon;
  export const ArrowDown: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const ArrowUpLeft: LucideIcon;
  export const ArrowDownRight: LucideIcon;
  export const Shield: LucideIcon;
  export const CheckIcon: LucideIcon;
  export const Check: LucideIcon;
  export const Star: LucideIcon;
  export const Github: LucideIcon;
  export const Twitter: LucideIcon;
  export const Mail: LucideIcon;
  export const Monitor: LucideIcon;
  export const Users: LucideIcon;
  export const Globe: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const MapPin: LucideIcon;
  export const Send: LucideIcon;
  export const BarChart: LucideIcon;
  export const ClipboardIcon: LucideIcon;
  export const ArrowUpDown: LucideIcon;
  export const BarChart2: LucideIcon;
  export const Database: LucideIcon;
  export const Gem: LucideIcon;
  export const Settings: LucideIcon;
  export const Home: LucideIcon;
  export const Key: LucideIcon;
  export const X: LucideIcon;
  export const Puzzle: LucideIcon;
  export const ClipboardList: LucideIcon;
  export const PlusIcon: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const Upload: LucideIcon;
  export const Save: LucideIcon;
  export const Heart: LucideIcon;
  export const Palette: LucideIcon;
  export const User: LucideIcon;
   // Add any other icons you're using in your project
}