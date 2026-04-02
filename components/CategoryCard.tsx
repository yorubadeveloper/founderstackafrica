import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/lib/types"

interface CategoryCardProps {
  category: Category
  toolCount?: number
}

export function CategoryCard({ category, toolCount }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <Card className="bg-card border border-border rounded-xl hover:border-border/80 hover:shadow-sm dark:hover:shadow-none dark:hover:border-border/60 transition-all duration-150 cursor-pointer h-full">
        <CardContent className="p-5 flex flex-col items-center text-center gap-2">
          <span className="text-2xl">{category.icon}</span>
          <h3 className="font-semibold text-base text-foreground">{category.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{category.tagline}</p>
          {toolCount !== undefined && (
            <span className="text-xs text-muted-foreground mt-1">
              {toolCount} {toolCount === 1 ? "tool" : "tools"}
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
