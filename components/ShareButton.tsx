"use client"

import { useState, useRef, useEffect } from "react"
import { ShareNetwork, XLogo, LinkedinLogo, Link as LinkIcon, Check, WhatsappLogo } from "@phosphor-icons/react/dist/ssr"

interface ShareButtonProps {
  title: string
  text?: string
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  const handleShare = () => {
    setOpen((o) => !o)
  }

  const url = typeof window !== "undefined" ? window.location.href : ""
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(text || title)

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setOpen(false)
    }, 1500)
  }

  const shareLinks = [
    {
      name: "X (Twitter)",
      icon: <XLogo size={16} weight="bold" />,
      href: `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: <LinkedinLogo size={16} weight="bold" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      icon: <WhatsappLogo size={16} weight="bold" />,
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-full border border-border text-muted-foreground text-sm font-medium h-9 px-4 hover:bg-accent hover:text-foreground transition-colors"
      >
        <ShareNetwork size={14} weight="bold" />
        Share
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
            >
              {link.icon}
              {link.name}
            </a>
          ))}
          <button
            onClick={copyLink}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors w-full border-t border-border"
          >
            {copied ? <Check size={16} weight="bold" /> : <LinkIcon size={16} weight="bold" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  )
}
