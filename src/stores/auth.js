import { ref, computed } from "vue";
import { defineStore } from "pinia";
import AuthService from "../services/auth";

export const useAuthStore = defineStore("auth", () => {
  const usuario = ref(null)
  const permissoes = ref({})
  const estabelecimentos = ref([])

  const isAuthenticated = computed(() => !!usuario.value?.codigo)
  const getNivelManutencao = computed(() => permissoes.value.manutencao)
  const getNivelAcesso = computed(() => permissoes.value.acesso)
  const getNivelAnalise = computed(() => permissoes.value.analise)
  const getNivelSolicitacaoAnalise = computed(() => permissoes.value.solicitacaoSenhaAnalise)
  const getNivelPropostaAcesso = computed(() => permissoes.value.propostaAcesso)
  const getNivelPropostaAnalise = computed(() => permissoes.value.propostaAnalise)
  const getNivelPropostaDeletar = computed(() => permissoes.value.propostaDeletar)
  const getNivelLoja = computed(() => permissoes.value.loja)
  const getNivelParametro = computed(() => permissoes.value.parametros)
  const getNivelManutencaoCliente = computed(() => permissoes.value.manutencaoCliente)
  const getNivelPixBaixaManual = computed(() => permissoes.value.ordemPagamentoBaixaManual)
  const getNivelEdicaoLoja = computed(() => permissoes.value.lojaEdicao)
  const getNivelCampanhaQuitacaoDivida = computed(() => permissoes.value.campanhaQuitacaoDivida)

  const signIn = async (login, senha) => {
    try {
      const { data } = await AuthService.getValidarUsuario(login, senha)
      
      const codigo = data?.result?.[0] || null;
      if (!codigo || codigo <= 0) throw new Error('Usuário inválido')

      const permissoesList = [
        "crediweb.usuario.manutencao",
        "crediweb.usuario.acesso",
        "crediweb.gerente.acesso",
        "crediweb.liberacao.analise",
        "crediweb.solicitacao_senha.analise",
        "crediweb.proposta.acesso",
        "crediweb.proposta.analise",
        "crediweb.proposta.deletar",
        "crediweb.usuario.loja",
        "crediweb.parametros",
        "crediweb.manutencaocliente",
        "crediweb.ordem_pagamento.baixa_manual",
        "crediweb.loja.edicao",
        "crediweb.campanha_quitacao_divida"
      ]

      const [dadosUsuarioResponse, permissoesResponse, estabelecimentosResponse] = await Promise.all([
        AuthService.getObterDadosUsuario(codigo),
        Promise.all(permissoesList.map(p => AuthService.getObterPermissao(codigo, p))),
        AuthService.getObterEstabelecimentosUsuarioCompleto(codigo)
      ])

      usuario.value = {
        codigo,
        login,
        nome: dadosUsuarioResponse.data?.result?.[0] || null,
        email: dadosUsuarioResponse.data?.result?.[1] || null,
        ativo: dadosUsuarioResponse.data?.result?.[2] || null,
      }

      permissoes.value = {
        manutencao: Boolean(permissoesResponse[0].data?.result?.[0]),
        acesso: Boolean(permissoesResponse[1].data?.result?.[0]),
        analise: Boolean(permissoesResponse[2].data?.result?.[0]),
        solicitacaoSenhaAnalise: Boolean(permissoesResponse[3].data?.result?.[0]),
        propostaAcesso: Boolean(permissoesResponse[4].data?.result?.[0]),
        propostaAnalise: Boolean(permissoesResponse[5].data?.result?.[0]),
        propostaDeletar: Boolean(permissoesResponse[6].data?.result?.[0]),
        loja: Boolean(permissoesResponse[7].data?.result?.[0]),
        parametros: Boolean(permissoesResponse[8].data?.result?.[0]),
        manutencaoCliente: Boolean(permissoesResponse[9].data?.result?.[0]),
        ordemPagamentoBaixaManual: Boolean(permissoesResponse[10].data?.result?.[0]),
        lojaEdicao: Boolean(permissoesResponse[11].data?.result?.[0]),
        campanhaQuitacaoDivida: Boolean(permissoesResponse[12].data?.result?.[0]),
      }

      estabelecimentos.value = estabelecimentosResponse.data?.result?.[0] || []      
    } catch (error) {
      throw new Error(error.message || 'Erro ao autenticar')
    }
  }

  const validarNivel = (...niveis) => {
    return niveis.every((nivel) => nivelAcesso.value[nivel] > 0);
  };

  return {
    usuario,
    permissoes,
    estabelecimentos,
    signIn,
    isAuthenticated,
    getNivelManutencao,
    getNivelAcesso,
    getNivelAnalise,
    getNivelSolicitacaoAnalise,
    getNivelPropostaAcesso,
    getNivelPropostaAnalise,
    getNivelPropostaDeletar,
    getNivelLoja,
    getNivelParametro,
    getNivelManutencaoCliente,
    getNivelPixBaixaManual,
    getNivelEdicaoLoja,
    getNivelCampanhaQuitacaoDivida,
    validarNivel
  };
}, {
  persist: true
});
