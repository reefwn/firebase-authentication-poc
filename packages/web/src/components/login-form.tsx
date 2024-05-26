"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebase"
import { AlertTriangleIcon } from "lucide-react"

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        console.log('Successfully logged in');
        console.log('response', res)
    } catch (err) {
        setError('failed to login');
        console.error(err);
    }
  };

  return (
    <Card>
      {
        error && (
          <div className="w-200">
            <Alert>
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )
      }

      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="example@example.com" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>Login</Button>
      </CardFooter>
    </Card>
  )
}

export default LoginForm;