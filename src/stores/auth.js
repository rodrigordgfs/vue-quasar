// src/stores/auth.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import AuthService from '../services/auth'
import { encryptedStorage } from '../plugins/encryptedStorage'
import { niveisPermissao } from '../utils/niveisPermissao'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null)
  const permissoes = ref({})
  const estabelecimentos = ref([])
  const loginTimestamp = ref(null)

  const router = useRouter()
  const isAuthenticated = computed(() => !!usuario.value?.codigo)
  const getNivel = (key) => computed(() => permissoes.value[key])

  const signIn = async (login, senha) => {
    try {
      console.log('[signIn] Iniciando autenticação...')
      const { data } = await AuthService.getValidarUsuario(login, senha)
      const codigo = data?.result?.[0] || null
      if (!codigo || codigo <= 0) throw new Error('Usuário inválido')

      console.log('[signIn] Código do usuário:', codigo)

      const [dadosUsuarioResponse, permissoesResponse, estabelecimentosResponse] = await Promise.all([
        AuthService.getObterDadosUsuario(codigo),
        Promise.all(
          Object.values(niveisPermissao).map(p => AuthService.getObterPermissao(codigo, p))
        ),
        AuthService.getObterEstabelecimentosUsuarioCompleto(codigo)
      ])

      usuario.value = {
        codigo,
        login,
        nome: dadosUsuarioResponse.data?.result?.[0] || null,
        email: dadosUsuarioResponse.data?.result?.[1] || null,
        ativo: dadosUsuarioResponse.data?.result?.[2] || null
      }

      permissoes.value = Object.fromEntries(
        Object.keys(niveisPermissao).map((key, idx) => [
          key,
          Boolean(permissoesResponse[idx]?.data?.result?.[0])
        ])
      )

      estabelecimentos.value = estabelecimentosResponse.data?.result?.[0] || []
      loginTimestamp.value = new Date().toISOString()

      console.log('[signIn] Permissões carregadas:', permissoes.value)
      console.log('[signIn] Estabelecimentos:', estabelecimentos.value)
      console.log('[signIn] Login realizado em:', loginTimestamp.value)
    } catch (error) {
      console.error('[signIn] Erro na autenticação:', error)
      throw new Error(error.message || 'Erro ao autenticar')
    }
  }

  const logout = () => {
    usuario.value = null
    permissoes.value = {}
    estabelecimentos.value = []
    loginTimestamp.value = null
    encryptedStorage.clear()
    console.log('[logout] Sessão encerrada e storage limpo.')
    router.replace('/login')
  }

  const validarNivel = (...niveis) => {
    return niveis.every(nivel => permissoes.value[nivel])
  }

  return {
    usuario,
    permissoes,
    estabelecimentos,
    loginTimestamp,
    signIn,
    logout,
    isAuthenticated,
    validarNivel,
    getNivelManutencao: getNivel('manutencao'),
    getNivelAcesso: getNivel('acesso'),
    getNivelAnalise: getNivel('analise'),
    getNivelSolicitacaoAnalise: getNivel('solicitacaoSenhaAnalise'),
    getNivelPropostaAcesso: getNivel('propostaAcesso'),
    getNivelPropostaAnalise: getNivel('propostaAnalise'),
    getNivelPropostaDeletar: getNivel('propostaDeletar'),
    getNivelLoja: getNivel('loja'),
    getNivelParametro: getNivel('parametros'),
    getNivelManutencaoCliente: getNivel('manutencaoCliente'),
    getNivelPixBaixaManual: getNivel('ordemPagamentoBaixaManual'),
    getNivelEdicaoLoja: getNivel('lojaEdicao'),
    getNivelCampanhaQuitacaoDivida: getNivel('campanhaQuitacaoDivida')
  }
}, {
  persist: {
    storage: encryptedStorage
  }
})