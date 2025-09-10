import { ChakraProvider } from "@chakra-ui/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { chakraSystem } from "components/ui/theme"
import { Toaster } from "components/ui/toaster"
import { queryClient } from "config/queryClient"
import { ThemeProvider } from "next-themes"
import { PropsWithChildren } from "react"

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={chakraSystem}>
        <ThemeProvider attribute="class" disableTransitionOnChange enableSystem={false} forcedTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default AppProvider
