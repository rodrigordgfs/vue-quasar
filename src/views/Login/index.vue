<template>
    <q-page class="flex flex-center q-pa-md bg-grey-2">
      <q-card class="q-pa-lg shadow-2" style="width: 360px">
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>
  
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="login"
            label="Usuário"
            filled
            dense
            autofocus
            :rules="[val => !!val || 'Usuário obrigatório']"
          />
          <q-input
            v-model="senha"
            label="Senha"
            filled
            dense
            type="password"
            :rules="[val => !!val || 'Senha obrigatória']"
          />
  
          <q-btn type="submit" label="Entrar" color="primary" class="full-width" :loading="loading" />
        </q-form>
  
        <q-card-section v-if="error" class="text-negative text-caption q-mt-sm">
          {{ error }}
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../../stores/auth'
  
  const login = ref('')
  const senha = ref('')
  const error = ref('')
  const loading = ref(false)
  
  const { signIn, usuario } = useAuthStore()
  const router = useRouter()

  onMounted(() => {
    if (usuario?.codigo) {
        router.replace('/')
    }
    })
  
  const onSubmit = async () => {
    error.value = ''
    loading.value = true
    try {
      await signIn(login.value, senha.value)
      router.replace('/')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .full-width {
    width: 100%;
  }
  </style>
  