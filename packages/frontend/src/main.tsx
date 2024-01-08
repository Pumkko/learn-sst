import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify'
import { CONFIG } from './config.ts';
import { AuthContextProvider } from './AuthContext.tsx';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: CONFIG.cognito.USER_POOL_ID,
      userPoolClientId: CONFIG.cognito.APP_CLIENT_ID,
      identityPoolId: CONFIG.cognito.IDENTITY_POOL_ID,
      allowGuestAccess: false
    }
  },
  Storage: {
    S3: {
      bucket: CONFIG.s3.BUCKET,
      region: CONFIG.s3.REGION,
    }
  },
  API: {
    REST: {
      notes: {
        endpoint: CONFIG.apiGateway.URL,
        region: CONFIG.apiGateway.REGION
      }
    }
  }
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter >
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </QueryClientProvider>
    </BrowserRouter >
  </React.StrictMode>,
)
