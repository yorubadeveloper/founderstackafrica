import Link from "next/link"
import type { Category } from "@/lib/types"

interface CategoryCardProps {
  category: Category
  toolCount?: number
}

export function CategoryCard({ category, toolCount }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="shadow-card rounded-xl cursor-pointer h-full">
        <div className="p-4 sm:p-5 flex flex-col gap-2">
          <span className="text-2xl leading-none">{category.icon}</span>
          <h3 className="font-medium text-sm text-foreground mt-1">{category.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{category.tagline}</p>
          {toolCount !== undefined && (
            <span className="text-xs text-muted-foreground/60 mt-auto pt-1">
              {toolCount} {toolCount === 1 ? "tool" : "tools"}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
