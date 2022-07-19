const HomeWelcome = () => import("@/views/home/welcome.vue");
import LayoutMain from "@/components/layout/layout-main.vue";
const routes = [
  {
    path: "/",
    name: "layout",
    component: LayoutMain,
    children: [
      {
        path: "welcome",
        name: "HomeWelcome",
        component: HomeWelcome,
        meta: { title: "欢迎" },
      },
    ],
  },
];

export default routes;
