"use client"

import { useState } from "react"
import Image from "next/image"
import { login, register } from "@/services/authService"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setErrorMsg("")

    const { error } = isLogin
      ? await login(email, password)
      : await register(email, password)

    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    if (isLogin) {
      router.replace('/dashboard')
      router.refresh()
    } else {
      // 🔥 lebih smooth: tidak redirect
      setIsLogin(true)
      setErrorMsg("Register berhasil, silakan login")
    }
  }

  return (
    <div className="flex min-h-screen">
      
      {/* LEFT */}
      <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center relative">
        <Image
            src="/gunung.jpg"
            alt="gambar"
            fill
            className="object-cover"
        />
      </div>


      {/* RIGHT */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <form onSubmit={handleAuth} className="w-[350px]">

          <h2 className="text-2xl font-semibold text-black mb-2">
            {isLogin ? "Sign in" : "Sign up"}
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Welcome to logistics supply chain platform
          </p>

          <input
            type="email"
            placeholder="E-mail"
            className="w-full mb-4 p-3 border rounded text-black placeholder:text-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 border rounded text-black placeholder:text-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLogin && (
            <div className="flex items-center text-sm mb-4 text-gray-500">
              <input type="checkbox" className="mr-2" />
              <span>I agree to the terms</span>
            </div>
          )}

          {errorMsg && <p className="text-red-500">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading
              ? "Loading..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>

          <p className="text-sm mt-4 text-center text-gray-500">
            {isLogin ? "Don't have an account?" : "Already a member?"}
            <span
              className="text-blue-700 ml-1 cursor-pointer"
              onClick={() => {
                setIsLogin(!isLogin)
                setErrorMsg("")
                setEmail("")
                setPassword("")
              }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </p>

        </form>
      </div>

    </div>
  )
}
