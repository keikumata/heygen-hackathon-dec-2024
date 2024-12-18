'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { User } from 'lucide-react'
import { useMessages } from '@/app/context/MessageContext'
import { cn } from '@/lib/utils'

export interface Message {
  id: string
  username: string
  content: string
  timestamp: Date
}

interface ChatProps {
  className?: string
  messages: Message[]
  onNewMessage: (message: string) => void
  disabled?: boolean
}

export function Chat({ className, messages, onNewMessage, disabled }: ChatProps) {
  const [inputValue, setInputValue] = useState('')
  const [username, setUsername] = useState('')
  const [isSettingUsername, setIsSettingUsername] = useState(!localStorage.getItem('username'))

  useEffect(() => {
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !disabled) {
      onNewMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleSetUsername = (newUsername: string) => {
    if (newUsername.trim()) {
      setUsername(newUsername.trim())
      localStorage.setItem('username', newUsername.trim())
      setIsSettingUsername(false)
    }
  }

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Live Chat</h2>
          <Dialog open={isSettingUsername} onOpenChange={setIsSettingUsername}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Your Username</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    defaultValue={username}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSetUsername(e.currentTarget.value)
                      }
                    }}
                  />
                </div>
                <Button onClick={() => {
                  const input = document.getElementById('username') as HTMLInputElement
                  handleSetUsername(input.value)
                }}>
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <ScrollArea className="h-full">
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold">{message.username}</span>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="bg-muted rounded-lg p-2 mt-1">
                {message.content}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={disabled ? "Chat session ended" : "Type a message..."}
            disabled={disabled}
            className="flex-grow"
          />
          <Button type="submit" disabled={disabled}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

