import { createRouter, createWebHistory } from "vue-router";

import { useSessionStore } from "@/stores/session";

import LoginView from "@/views/LoginView.vue";
import Layout from "@/components/Layout.vue";

const adminMiddleware = (to, from, next) => {
  const session = useSessionStore();
  if (session.user.role === "admin") {
    next();
  } else {
    next({ name: "" });
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/login/admin",
      name: "LoginAdmin",
      component: LoginView,
    },
    {
      path: "/",
      name: "Layout",
      component: Layout,
      children: [
        {
          path: "",
          name: "Home",
          component: () => import("@/views/HomeView.vue"),
        },
        {
          path: "users",
          name: "Users",
          component: () => import("@/views/User/UserView.vue"),
          beforeEnter: adminMiddleware,
        },
        {
          path: "products",
          name: "Productos",
          component: () => import("@/views/Product/ProductView.vue"),
          beforeEnter: adminMiddleware,
        },
        {
          path: "categories",
          name: "Categorias",
          component: () => import("@/views/Category/CategoryView.vue"),
          beforeEnter: adminMiddleware,
        },
        {
          path: "assignments",
          name: "Asignaciones",
          component: () => import("@/views/Assignment/AssignmentView.vue"),
        },
        {
          path: "profile",
          name: "Profile",
          component: () => import("@/views/ProfileView.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const session = useSessionStore();
  if (
    !["/login", "/login/admin"].includes(to.fullPath) &&
    session.token === ""
  ) {
    return "/login";
  }
});

export default router;
