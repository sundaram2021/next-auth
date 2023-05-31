'use client'

import { SessionProvider, useSession } from 'next-auth/react';


const Provider = ({ children } : { children : React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default Provider