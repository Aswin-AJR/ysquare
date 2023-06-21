import Login from '@/components/Authendication'
import ResponsiveAppBar from '@/layout/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import "../styles/authendication.scss"
import "../styles/user.scss"
import "../styles/index.scss"
import "../styles/global.scss"
import React, { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";


export const UserContext = createContext<any>("")

export default function App({ Component, pageProps }: AppProps) {
  const [route, setRoute] = useState(false);
  const router = useRouter()

  const handleRoute = (data: any) => {
    setRoute(data)
    if (data?.role.toUpperCase() === "ASSISTANT") {
      router.push({ pathname: "/customer" })
    }
  }
  return (
    <>
      {!route ? <Login handleRoute={(data: any) => handleRoute(data)} /> :
        <UserContext.Provider value={route}>
          <ResponsiveAppBar >
            <Component {...pageProps} />
          </ResponsiveAppBar>
        </UserContext.Provider>

      }
    </>
  )
}
