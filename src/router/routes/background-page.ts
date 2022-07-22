import LayoutMain from "@/components/layout/layout-main.vue";
const HomeWelcome = () => import("@/views/background-page/welcome.vue");
const YJPage = () => import("@/views/background-page/yj.vue");
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
      {
        path: "yj",
        name: "YJ",
        component: YJPage,
        meta: { title: "yj需求" },
      },
    ],
  },
];

export default routes;
