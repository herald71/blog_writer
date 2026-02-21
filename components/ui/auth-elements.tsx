import * as React from "react"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white ring-offset-background transition-all duration-300 placeholder:text-gray-500 focus:bg-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

const Button = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> & { variant?: "primary" | "outline" }
>(({ className, variant = "primary", ...props }, ref) => {
    const variantStyles =
        variant === "outline"
            ? "border border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-white/20"
            : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:from-blue-500 hover:to-blue-400 hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] active:scale-[0.98]"

    return (
        <button
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] disabled:pointer-events-none disabled:opacity-50 h-12 px-6 w-full ${variantStyles} ${className || ""}`}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Input, Button }
