/**
 * Icon — renders a Lucide glyph by kebab-case name. Only the icons Orbit uses
 * are registered (keeps the bundle lean; Lucide ships 3000+). Add to the map as
 * new glyphs are needed.
 */
import React from 'react';
import {
  AtSign,
  Bell,
  BellRing,
  Briefcase,
  Cake,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleCheckBig,
  Clock,
  Database,
  Ellipsis,
  Flame,
  Folder,
  Gift,
  House,
  Info,
  Layers,
  Link,
  Link2,
  Mail,
  MessageCircle,
  MessageSquare,
  PenLine,
  Palette,
  Phone,
  Plus,
  Repeat,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  Sun,
  Users,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import { colors } from '@/theme/theme';

const REGISTRY: Record<string, LucideIcon> = {
  'at-sign': AtSign,
  bell: Bell,
  'bell-ring': BellRing,
  briefcase: Briefcase,
  cake: Cake,
  camera: Camera,
  check: Check,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-check': CircleCheck,
  'circle-check-big': CircleCheckBig,
  clock: Clock,
  database: Database,
  ellipsis: Ellipsis,
  flame: Flame,
  folder: Folder,
  gift: Gift,
  house: House,
  info: Info,
  layers: Layers,
  link: Link,
  'link-2': Link2,
  mail: Mail,
  'message-circle': MessageCircle,
  'message-square': MessageSquare,
  'pen-line': PenLine,
  palette: Palette,
  phone: Phone,
  plus: Plus,
  repeat: Repeat,
  search: Search,
  send: Send,
  settings: Settings,
  'sliders-horizontal': SlidersHorizontal,
  sun: Sun,
  users: Users,
  'user-round': UserRound,
  x: X,
};

export type IconName = keyof typeof REGISTRY | string;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color = colors.textBody, strokeWidth = 2 }: IconProps) {
  const Glyph = REGISTRY[name];
  if (!Glyph) {
    if (__DEV__) console.warn(`[Icon] unknown icon "${name}"`);
    return null;
  }
  return <Glyph size={size} color={color} strokeWidth={strokeWidth} />;
}

export default Icon;
