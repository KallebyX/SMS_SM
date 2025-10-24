import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  Menu,
  X,
  Home,
  Trophy,
  GraduationCap,
  MessageCircle,
  Calendar,
  FolderKanban,
  FileText,
  Link as LinkIcon,
  User,
  Settings,
  BarChart3,
  Shield,
  Bell,
  Search,
  ChevronDown,
  LogOut
} from 'lucide-react'

import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { useAuth } from '../providers/AuthProvider'

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Gamificação', href: '/gamification', icon: Trophy },
    { name: 'Treinamentos', href: '/training', icon: GraduationCap },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Agenda', href: '/calendar', icon: Calendar },
    { name: 'Projetos', href: '/projects', icon: FolderKanban },
    { name: 'Políticas', href: '/policies', icon: FileText },
    { name: 'Links', href: '/links', icon: LinkIcon },
    { name: 'Perfil', href: '/profile', icon: User },
    { name: 'Configurações', href: '/settings', icon: Settings },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Admin', href: '/admin', icon: Shield },
  ]

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="SMS-SM"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">SMS-SM</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const current = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      current
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img
                  className="h-8 w-auto"
                  src="/logo.svg"
                  alt="SMS-SM"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">SMS-SM</span>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => {
                  const current = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        current
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <item.icon
                        className={`${
                          current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 flex-shrink-0 h-5 w-5`}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <form className="w-full flex md:ml-0" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Buscar
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
                    placeholder="Buscar..."
                    type="search"
                    name="search"
                  />
                </div>
              </form>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <Avatar
                      src={user?.avatar}
                      alt={user?.name || 'User'}
                      fallback={user?.name || 'U'}
                      size="sm"
                    />
                    <span className="hidden md:block ml-3 text-gray-700 text-sm font-medium">
                      {user?.name}
                    </span>
                    <ChevronDown className="hidden md:block ml-2 h-4 w-4 text-gray-400" />
                  </button>
                </div>
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Seu Perfil
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Configurações
                    </Link>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                      }}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}