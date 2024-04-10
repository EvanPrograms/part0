import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CounterContextProvider } from './CounterContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <CounterContextProvider>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  </CounterContextProvider>
)