import { CircularProgress } from "@mui/material"
import React, { useEffect, useContext } from 'react';
import { UserContext } from "./_app";
import { useRouter } from "next/router";
function Index() {
  const userInfo: any = useContext(UserContext)
  const router = useRouter()
  useEffect(() => {
    if (userInfo?.createdBy) {
      router.push({ pathname: "/customer" })
    } else {
      router.push({ pathname: "/user" })
    }
    console.log('%c⧭', 'color: #00b300', userInfo?.role);
  }, [])

  console.log('%c⧭', 'color: #1d5673',);
  return (
    <div className="loading">
      <CircularProgress />
    </div>

  )

}
export default Index