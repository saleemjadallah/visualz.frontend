/**
 * LineIcons Integration System
 * 
 * This file provides a centralized mapping between commonly used lucide-react icons
 * and their LineIcons equivalents from the @icons/ directory.
 * 
 * Usage:
 * import { LineIcons } from '@/lib/icons';
 * <LineIcons.Camera />
 */

// Import LineIcons from the @icons/ directory
import Camera2 from '../../../icons/camera-2';
import Camera3 from '../../../icons/camera-3';
import Upload2 from '../../../icons/upload-2';
import Upload3 from '../../../icons/upload-3';
import Share2Circle1 from '../../../icons/share-2-circle-1';
import Share2Square1 from '../../../icons/share-2-square-1';
import MenuHamburger2 from '../../../icons/menu-hamburger-2';
import Globe2 from '../../../icons/globe-2';
import Globe3 from '../../../icons/globe-3';
import BagShopping1 from '../../../icons/bag-shopping-1';
import User1 from '../../../icons/user-1';
import User2 from '../../../icons/user-2';
import Settings1 from '../../../icons/settings-1';
import Settings2 from '../../../icons/settings-2';
import ChevronRight from '../../../icons/chevron-right';
import Search1 from '../../../icons/search-1';
import Search2 from '../../../icons/search-2';
import Eye1 from '../../../icons/eye-1';
import Eye2 from '../../../icons/eye-2';
import EyeOff1 from '../../../icons/eye-off-1';
import AlertCircle1 from '../../../icons/alert-circle-1';
import Check1 from '../../../icons/check-1';
import Check2 from '../../../icons/check-2';
import X1 from '../../../icons/x-1';
import X2 from '../../../icons/x-2';
import Refresh1 from '../../../icons/refresh-1';
import Refresh2 from '../../../icons/refresh-2';
import Download1 from '../../../icons/download-1';
import Download2 from '../../../icons/download-2';
import Palette1 from '../../../icons/palette-1';
import Palette2 from '../../../icons/palette-2';
import Sparkles1 from '../../../icons/sparkles-1';
import Home1 from '../../../icons/home-1';
import Home2 from '../../../icons/home-2';
import Mail1 from '../../../icons/mail-1';
import Mail2 from '../../../icons/mail-2';
import Info1 from '../../../icons/info-1';
import Info2 from '../../../icons/info-2';
import Copy1 from '../../../icons/copy-1';
import Copy2 from '../../../icons/copy-2';
import Users1 from '../../../icons/users-1';
import Users2 from '../../../icons/users-2';
import Cube3D1 from '../../../icons/3d-cube-1';
import Cube3D2 from '../../../icons/3d-cube-2';
import Rotate3D1 from '../../../icons/3d-rotate-1';
import Rotate3D2 from '../../../icons/3d-rotate-2';

// Icon mapping object for easy replacement of lucide-react icons
export const LineIcons = {
  // Camera icons
  Camera: Camera2,
  CameraAlt: Camera3,
  
  // Upload icons
  Upload: Upload2,
  UploadAlt: Upload3,
  
  // Share icons
  Share: Share2Circle1,
  ShareSquare: Share2Square1,
  
  // Menu icons
  Menu: MenuHamburger2,
  
  // Globe icons
  Globe: Globe2,
  GlobeAlt: Globe3,
  
  // Shopping icons
  ShoppingBag: BagShopping1,
  
  // User icons
  User: User1,
  UserAlt: User2,
  Users: Users1,
  UsersAlt: Users2,
  
  // Settings icons
  Settings: Settings1,
  SettingsAlt: Settings2,
  
  // Navigation icons
  ChevronRight: ChevronRight,
  
  // Search icons
  Search: Search1,
  SearchAlt: Search2,
  
  // Eye icons
  Eye: Eye1,
  EyeAlt: Eye2,
  EyeOff: EyeOff1,
  
  // Alert icons
  AlertCircle: AlertCircle1,
  
  // Check icons
  Check: Check1,
  CheckAlt: Check2,
  
  // Close icons
  X: X1,
  XAlt: X2,
  
  // Refresh icons
  Refresh: Refresh1,
  RefreshAlt: Refresh2,
  
  // Download icons
  Download: Download1,
  DownloadAlt: Download2,
  
  // Palette icons
  Palette: Palette1,
  PaletteAlt: Palette2,
  
  // Sparkles icons
  Sparkles: Sparkles1,
  
  // Home icons
  Home: Home1,
  HomeAlt: Home2,
  
  // Mail icons
  Mail: Mail1,
  MailAlt: Mail2,
  
  // Info icons
  Info: Info1,
  InfoAlt: Info2,
  
  // Copy icons
  Copy: Copy1,
  CopyAlt: Copy2,
  
  // 3D icons
  Cube3D: Cube3D1,
  Cube3DAlt: Cube3D2,
  Rotate3D: Rotate3D1,
  Rotate3DAlt: Rotate3D2,
};

// Type definitions for better TypeScript support
export type LineIconName = keyof typeof LineIcons;

// Helper function to get icon component
export const getLineIcon = (name: LineIconName) => {
  return LineIcons[name];
};

// Common icon props interface
export interface LineIconProps {
  title?: string;
  className?: string;
  size?: number;
  color?: string;
  onClick?: () => void;
}

// HOC for consistent icon styling
export const withLineIconProps = (IconComponent: React.ComponentType<any>) => {
  return ({ size = 24, color = 'currentColor', className = '', ...props }: LineIconProps) => {
    return (
      <IconComponent
        {...props}
        className={className}
        style={{
          width: size,
          height: size,
          color,
          ...props.style,
        }}
      />
    );
  };
};

// Export commonly used icons with consistent props
export const StyledLineIcons = {
  Camera: withLineIconProps(LineIcons.Camera),
  Upload: withLineIconProps(LineIcons.Upload),
  Share: withLineIconProps(LineIcons.Share),
  Menu: withLineIconProps(LineIcons.Menu),
  Globe: withLineIconProps(LineIcons.Globe),
  ShoppingBag: withLineIconProps(LineIcons.ShoppingBag),
  User: withLineIconProps(LineIcons.User),
  Settings: withLineIconProps(LineIcons.Settings),
  Search: withLineIconProps(LineIcons.Search),
  Eye: withLineIconProps(LineIcons.Eye),
  EyeOff: withLineIconProps(LineIcons.EyeOff),
  Check: withLineIconProps(LineIcons.Check),
  X: withLineIconProps(LineIcons.X),
  Download: withLineIconProps(LineIcons.Download),
  Palette: withLineIconProps(LineIcons.Palette),
  Sparkles: withLineIconProps(LineIcons.Sparkles),
  Home: withLineIconProps(LineIcons.Home),
  Mail: withLineIconProps(LineIcons.Mail),
  Info: withLineIconProps(LineIcons.Info),
  Copy: withLineIconProps(LineIcons.Copy),
  Users: withLineIconProps(LineIcons.Users),
  Cube3D: withLineIconProps(LineIcons.Cube3D),
  Rotate3D: withLineIconProps(LineIcons.Rotate3D),
};

export default LineIcons;