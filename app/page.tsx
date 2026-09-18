import Dashboard from './components/Dashboard'
import { isMockMode } from '@/lib/ring/client'

export default function Page() {
  return <Dashboard mock={isMockMode()} />
}
