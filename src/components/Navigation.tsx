import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderHeart,
  Calendar,
  MessageSquare,
  BarChart2,
  Bot,
  Settings,
  Shield,
  Users,
  CreditCard,
  Link2,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from './ui/Tooltip';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  section?: string;
}

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const sidebarRef = useRef<HTMLElement>(null);
  const mouseInSidebarRef = useRef(false);

  const navItems: NavItem[] = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FolderHeart className="w-5 h-5" />, label: 'Content', path: '/content' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Schedule', path: '/schedule' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', path: '/messages' },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Analytics', path: '/analytics' },
    { icon: <Bot className="w-5 h-5" />, label: 'Automation', path: '/automation', section: 'Tools' },
    { icon: <Users className="w-5 h-5" />, label: 'Subscribers', path: '/subscribers' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Billing', path: '/billing' },
    { icon: <Link2 className="w-5 h-5" />, label: 'Integrations', path: '/integrations' },
    { icon: <Shield className="w-5 h-5" />, label: 'Verification', path: '/verification', section: 'Account' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' }
  ];

  // Handle auto-collapse
  useEffect(() => {
    const handleMouseEnter = () => {
      mouseInSidebarRef.current = true;
      setIsCollapsed(false);
    };

    const handleMouseLeave = () => {
      mouseInSidebarRef.current = false;
      setTimeout(() => {
        if (!mouseInSidebarRef.current) {
          setIsCollapsed(true);
        }
      }, 300);
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('mouseenter', handleMouseEnter);
      sidebar.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('mouseenter', handleMouseEnter);
        sidebar.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Auto-collapse on navigation (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-purple-900/90 rounded-lg border border-purple-800/50 backdrop-blur-sm md:hidden"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Menu */}
      <motion.nav
        ref={sidebarRef}
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 256,
          transition: { duration: 0.2 }
        }}
        className={`
          fixed inset-y-0 left-0 z-50
          bg-purple-900/95 backdrop-blur-sm
          border-r border-purple-800/30
          transition-all duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-hidden
        `}
      >
        <div className="flex flex-col h-full p-4">
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <React.Fragment key={item.path}>
                {item.section && !isCollapsed && (
                  <div className="text-xs font-medium text-gray-400 px-3 py-2 mt-4">
                    {item.section}
                  </div>
                )}
                {isCollapsed ? (
                  <Tooltip content={item.label} position="right">
                    <motion.button
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                      className={`
                        flex items-center justify-center w-full p-3 rounded-lg
                        transition-colors duration-200
                        ${location.pathname === item.path
                          ? 'bg-purple-800/50 text-white'
                          : 'text-gray-300 hover:bg-purple-800/30 hover:text-white'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`
                        ${location.pathname === item.path ? 'text-purple-400' : ''}
                      `}>
                        {item.icon}
                      </div>
                    </motion.button>
                  </Tooltip>
                ) : (
                  <motion.button
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className={`
                      flex items-center w-full px-3 py-2 rounded-lg
                      transition-colors duration-200
                      ${location.pathname === item.path
                        ? 'bg-purple-800/50 text-white'
                        : 'text-gray-300 hover:bg-purple-800/30 hover:text-white'
                      }
                    `}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`
                      flex items-center gap-3
                      ${location.pathname === item.path ? 'text-purple-400' : ''}
                    `}>
                      {item.icon}
                      <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    </div>
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="activeNav"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                      />
                    )}
                  </motion.button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Sign Out Button */}
          {isCollapsed ? (
            <Tooltip content="Sign Out" position="right">
              <motion.button
                onClick={handleSignOut}
                className="
                  flex items-center justify-center mt-auto
                  p-3 rounded-lg
                  text-gray-300 hover:text-red-400 hover:bg-red-900/20
                  transition-colors duration-200
                "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </Tooltip>
          ) : (
            <motion.button
              onClick={handleSignOut}
              className="
                flex items-center gap-3 mt-auto
                px-3 py-2 rounded-lg
                text-gray-300 hover:text-red-400 hover:bg-red-900/20
                transition-colors duration-200
              "
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </motion.button>
          )}
        </div>
      </motion.nav>
    </>
  );
}