<script>
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useSessionStore } from "@/stores/session";
import { getError } from "@/utils/helpers";
import resize from "@/components/resize";

export default defineComponent({
  name: "LoginView",
  setup() {
    const route = useRoute();
    const session = useSessionStore();
    return {
      route,
      session,
    };
  },
  mixins: [resize],
  data() {
    return {
      formData: {
        email: "admin@admin.com",
        password: "admin",
        isLoginAdmin: this.route.path.includes("admin"),
      },
      rules: {
        email: [
          {
            required: true,
            message: "Por favor ingresa el correo",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Por favor ingresa la contraseña",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const result = await this.session.login({ ...this.formData });

          if (result.error > 0) {
            ElMessage({
              type: "error",
              message: getError(result.data),
            });
          } else {
            ElMessage({
              type: "success",
              message: `Bienvenid@ ${this.session.user.name}`,
            });
            this.$router.push("/");
          }
        } else {
          return false;
        }
      });
    },
  },
});
</script>

<template>
  <el-row align="middle" justify="center">
    <el-col :xs="18" :sm="12" :md="10" :lg="8">
      <div class="logo_div">
        <img class="logo_main" src="@/assets/logo.png" />
      </div>
      <h1 class="text-center">Inicio de sesión</h1>
      <el-form
        ref="loginForm"
        :model="formData"
        status-icon
        :rules="rules"
        label-width="80px"
        :label-position="screen.labelPosition"
      >
        <el-form-item label="Correo" prop="email">
          <el-input
            v-model="formData.email"
            autocomplete="off"
            placeholder="Correo"
            :disabled="session.loading"
          />
        </el-form-item>
        <el-form-item label="Contraseña" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            autocomplete="off"
            placeholder="Contraseña"
            :disabled="session.loading"
          />
        </el-form-item>
        <el-form-item>
          <div class="align-right">
            <el-button
              type="primary"
              @click="submitForm('loginForm')"
              :loading="session.loading"
              >Acceder</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-row {
  min-height: 100vh;
}

.logo_main {
  width: 100px;
  height: auto;
}

.logo_div {
  text-align: center;
}
</style>
