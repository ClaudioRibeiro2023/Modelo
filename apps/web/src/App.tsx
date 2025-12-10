import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@template/shared'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageLoading } from '@/components/common/Loading'

// Eager-loaded pages (critical path)
import { LoginPage } from '@/pages/auth/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })))

// Admin pages (lazy)
const ConfigPage = lazy(() => import('@/pages/admin/ConfigPage').then(m => ({ default: m.ConfigPage })))
const UsersPage = lazy(() => import('@/pages/admin/UsersPage').then(m => ({ default: m.UsersPage })))

// Admin Config Pages (lazy)
const ModulesConfigPage = lazy(() => import('@/pages/admin/config/ModulesConfigPage').then(m => ({ default: m.ModulesConfigPage })))
const FiltersConfigPage = lazy(() => import('@/pages/admin/config/FiltersConfigPage').then(m => ({ default: m.FiltersConfigPage })))

// Modules (lazy)
const ExemploPage = lazy(() => import('@/modules/exemplo').then(m => ({ default: m.ExemploPage })))

// ETL Module
const ETLPage = lazy(() => import('@/modules/etl/ETLPage'))
const ETLCatalogPage = lazy(() => import('@/modules/etl/ETLCatalogPage'))
const ETLQualityPage = lazy(() => import('@/modules/etl/ETLQualityPage'))
const ETLLogsPage = lazy(() => import('@/modules/etl/ETLLogsPage'))

// Observability Module
const MetricsPage = lazy(() => import('@/modules/observability/MetricsPage'))
const LogsPage = lazy(() => import('@/modules/observability/LogsPage'))
const HealthPage = lazy(() => import('@/modules/observability/HealthPage'))
const DataQualityPage = lazy(() => import('@/modules/observability/DataQualityPage'))

// Docs Module
const DocsMainPage = lazy(() => import('@/modules/docs/DocsPage'))
const ApiDocsPage = lazy(() => import('@/modules/docs/ApiDocsPage'))
const ChangelogPage = lazy(() => import('@/modules/docs/ChangelogPage'))

// LGPD Module
const LGPDMainPage = lazy(() => import('@/modules/lgpd/LGPDPage'))
const ConsentPage = lazy(() => import('@/modules/lgpd/ConsentPage'))
const MyDataPage = lazy(() => import('@/modules/lgpd/MyDataPage'))

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with layout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Example module */}
            <Route path="/exemplo" element={<ExemploPage />} />
            <Route path="/exemplo/*" element={<ExemploPage />} />
            
            {/* Dashboard & Reports */}
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/dashboard/*" element={<HomePage />} />
            <Route path="/relatorios" element={<HomePage />} />
            <Route path="/relatorios/*" element={<HomePage />} />
            
            {/* ETL Module */}
            <Route path="/admin/etl" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <ETLPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/etl/catalog" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <ETLCatalogPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/etl/quality" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <ETLQualityPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/etl/logs" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <ETLLogsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/etl/*" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <ETLPage />
              </ProtectedRoute>
            } />
            
            {/* Observability Module */}
            <Route path="/admin/observability" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <MetricsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/observability/metrics" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <MetricsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/observability/logs" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <LogsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/observability/health" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <HealthPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/observability/data-quality" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <DataQualityPage />
              </ProtectedRoute>
            } />
            
            {/* Config & Admin */}
            <Route path="/admin/config" element={
              <ProtectedRoute requiredRoles={['ADMIN', 'GESTOR']}>
                <ConfigPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/config/modules" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <ModulesConfigPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/config/modules/*" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <ModulesConfigPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/config/filters" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <FiltersConfigPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/usuarios" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <ConfigPage />
              </ProtectedRoute>
            } />
            
            {/* Documentation Module */}
            <Route path="/docs" element={<DocsMainPage />} />
            <Route path="/docs/api" element={<ApiDocsPage />} />
            <Route path="/docs/changelog" element={<ChangelogPage />} />
            <Route path="/docs/*" element={<DocsMainPage />} />
            
            {/* LGPD Module */}
            <Route path="/lgpd" element={<LGPDMainPage />} />
            <Route path="/lgpd/consentimento" element={<ConsentPage />} />
            <Route path="/lgpd/meus-dados" element={<MyDataPage />} />
            <Route path="/lgpd/*" element={<LGPDMainPage />} />
          </Route>

          {/* Fallback */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App
