import { Guide } from "views/Component"
import { Home } from "views/Home"

const publicRoute = {
  guide: {
    component: Guide,
    name: "Component",
    path: "/component",
  },
  home: {
    component: Home,
    name: "Home",
    path: "/",
  },
}

export default publicRoute
