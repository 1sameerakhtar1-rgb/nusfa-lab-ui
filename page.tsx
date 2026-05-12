'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { BottomNavigation } from '@/components/layout/bottom-navigation'
import { DashboardScreen } from '@/components/screens/dashboard-screen'
import { SampleEntryScreen } from '@/components/screens/sample-entry-screen'
import { SamplesScreen } from '@/components/screens/samples-screen'
import { ReportsScreen } from '@/components/screens/reports-screen'
import { BillingScreen } from '@/components/screens/billing-screen'
import { AnalyticsScreen } from '@/components/screens/analytics-screen'
import { MoreScreen } from '@/components/screens/more-screen'
import { AuthScreen } from '@/components/screens/auth-screen'
import { SearchOverlay } from '@/components/search-overlay'
import { 
  DashboardSkeleton, 
  SamplesSkeleton, 
  ReportsSkeleton,
  BillingSkeleton,
  AnalyticsSkeleton,
  MoreSkeleton
} from '@/components/skeleton-loader'
import { cn } from '@/lib/utils'

type Screen = 'home' | 'samples' | 'reports' | 'billing' | 'analytics' | 'more' | 'new-sample'

const screenTitles: Record<Screen, { title: string; subtitle?: string }> = {
  'home': { title: 'PathLab Pro', subtitle: 'Laboratory Management' },
  'samples': { title: 'Samples', subtitle: 'Track all samples' },
  'reports': { title: 'Reports', subtitle: 'Manage reports' },
  'billing': { title: 'Billing', subtitle: 'Invoices & payments' },
  'analytics': { title: 'Analytics', subtitle: 'Business insights' },
  'more': { title: 'More', subtitle: 'Settings & tools' },
  'new-sample': { title: 'New Sample', subtitle: 'Register sample' },
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeScreen, setActiveScreen] = useState<Screen>('home')
  const [isLoading, setIsLoading] = useState(true)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleTabChange = (tab: string) => {
    setIsLoading(true)
    setActiveScreen(tab as Screen)
    setTimeout(() => setIsLoading(false), 300)
  }

  const handleNewSample = () => {
    setActiveScreen('new-sample')
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'new-sample':
        setActiveScreen('new-sample')
        break
      case 'pending-reports':
        setActiveScreen('reports')
        break
      case 'new-invoice':
        setActiveScreen('billing')
        break
      default:
        break
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setActiveScreen('home')
  }

  const renderScreen = () => {
    if (isLoading) {
      switch (activeScreen) {
        case 'home':
          return <DashboardSkeleton />
        case 'samples':
          return <SamplesSkeleton />
        case 'reports':
          return <ReportsSkeleton />
        case 'billing':
          return <BillingSkeleton />
        case 'analytics':
          return <AnalyticsSkeleton />
        case 'more':
          return <MoreSkeleton />
        default:
          return <DashboardSkeleton />
      }
    }

    switch (activeScreen) {
      case 'home':
        return <DashboardScreen onAction={handleAction} />
      case 'samples':
        return <SamplesScreen />
      case 'reports':
        return <ReportsScreen />
      case 'billing':
        return <BillingScreen />
      case 'analytics':
        return <AnalyticsScreen />
      case 'more':
        return <MoreScreen onNavigate={(screen) => {
          if (screen === 'logout') {
            handleLogout()
          }
        }} />
      case 'new-sample':
        return (
          <SampleEntryScreen 
            onBack={() => setActiveScreen('home')}
            onSubmit={(data) => {
              setActiveScreen('samples')
            }}
          />
        )
      default:
        return <DashboardScreen onAction={handleAction} />
    }
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-md min-h-screen">
          <AuthScreen onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    )
  }

  const currentScreenInfo = screenTitles[activeScreen]
  const showNavigation = activeScreen !== 'new-sample'

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="mx-auto max-w-md min-h-screen relative">
        {/* Header */}
        {showNavigation && (
          <Header
            title={currentScreenInfo.title}
            subtitle={currentScreenInfo.subtitle}
            onSearchClick={() => setIsSearchOpen(true)}
            notificationCount={3}
          />
        )}

        {/* Main Content */}
        <main className={cn(
          "px-4 py-4",
          showNavigation ? "pb-28" : "pb-4"
        )}>
          {renderScreen()}
        </main>

        {/* Bottom Navigation */}
        {showNavigation && (
          <BottomNavigation
            activeTab={activeScreen}
            onTabChange={handleTabChange}
            onNewSample={handleNewSample}
          />
        )}

        {/* Search Overlay */}
        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelect={(result) => {
            setIsSearchOpen(false)
            switch (result.type) {
              case 'sample':
                setActiveScreen('samples')
                break
              case 'report':
                setActiveScreen('reports')
                break
              case 'invoice':
                setActiveScreen('billing')
                break
            }
          }}
        />
      </div>
    </div>
  )
}
