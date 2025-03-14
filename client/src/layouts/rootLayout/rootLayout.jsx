import {Link, Outlet} from 'react-router-dom'
import './rootLayout.css'
import {ClerkProvider} from '@clerk/clerk-react'
import { SignedIn, UserButton } from "@clerk/clerk-react";
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')
}

const queryClient = new QueryClient()

const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <QueryClientProvider client={queryClient}>
            <div className="rootLayout">
                <header>
                    <Link to="/" className="logo">
                        <img src="/logo.png" alt=""/>
                        <span>Ash AI</span>
                    </Link>

                    <SignedIn>
                    <UserButton />
                    </SignedIn>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
        </QueryClientProvider>
        </ClerkProvider>
    )   
}

export default RootLayout