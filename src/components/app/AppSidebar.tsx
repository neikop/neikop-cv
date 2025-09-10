import { Button, Center, Drawer, Flex, Stack, Text } from "@chakra-ui/react"
import { JSX, ReactNode, useState } from "react"
import { MdMenu } from "react-icons/md"
import { Link, LinkProps, useLocation } from "react-router"
import { publicRoute } from "routes"

type MenuItemProps = {
  icon?: JSX.Element
  linkProps?: Partial<LinkProps>
  name?: ReactNode
  path: string
}

const MenuItem = ({ linkProps, name, path }: MenuItemProps) => {
  const location = useLocation()

  const isHome = path === "/"
  const isContain = location.pathname.startsWith(path)
  const isSelected = isHome ? location.pathname === path : isContain

  return (
    <Link to={path} {...linkProps}>
      <Center
        _hover={{ backgroundColor: "bg.subtle" }}
        borderTopColor={isSelected ? "primary.main" : "transparent"}
        borderTopWidth={{ base: "none", md: 3 }}
        h="full"
        pb={3}
        pt={2}
        px={6}
      >
        <Text as="div" color={isSelected ? "primary.dark" : "fg"} fontWeight="bold">
          {name}
        </Text>
      </Center>
    </Link>
  )
}

const MenuItems = () => {
  return (
    <>
      <MenuItem {...publicRoute.home} />
      <MenuItem {...publicRoute.guide} />
    </>
  )
}

const AppSidebar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Flex alignItems="stretch" display={{ base: "none", md: "flex" }} h="full">
        <MenuItems />
      </Flex>

      <Drawer.Root onOpenChange={(event) => setOpen(event.open)} open={open} placement="top">
        <Drawer.Backdrop />
        <Drawer.Trigger asChild>
          <Button display={{ base: "none", mdDown: "block" }}>
            <MdMenu />
          </Button>
        </Drawer.Trigger>
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.CloseTrigger />
            <Drawer.Body>
              <Stack onClick={() => setOpen(false)}>
                <MenuItems />
              </Stack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  )
}

export default AppSidebar
