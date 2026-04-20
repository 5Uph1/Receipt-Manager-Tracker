"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { supabaseClient } from "@/lib/client/supabaseClient"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabaseClient.auth.getUser()

      if (data.user) {
        router.replace('/dashboard')
      } else {
        router.replace('/auth')
      }
    }

    checkUser()
  }, [])

  return <div>Loading...</div>
}
