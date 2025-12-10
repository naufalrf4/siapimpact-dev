import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("mr-2 h-4 w-4 shrink-0 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
