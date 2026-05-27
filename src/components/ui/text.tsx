import * as React from "react";
import { cn } from "~/lib/utils";

const Text = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-base text-foreground", className)}
    {...props}
  />
));
Text.displayName = "Text";

export { Text };
