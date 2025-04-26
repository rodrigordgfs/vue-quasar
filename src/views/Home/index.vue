<template>
  <q-page class="q-pa-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Dados do Usuário</div>
        <div>Nome: {{ auth.usuario?.nome }}</div>
        <div>Email: {{ auth.usuario?.email }}</div>
        <div>Ativo: {{ auth.usuario?.ativo ? 'Sim' : 'Não' }}</div>
        <div>Código: {{ auth.usuario?.codigo }}</div>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Estabelecimentos</div>
        <q-table
          :rows="auth.estabelecimentos"
          :columns="columnsEstabelecimentos"
          row-key="IDEntidade"
        />
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">Permissões</div>
        <q-table
          :rows="rowsPermissoes"
          :columns="columnsPermissoes"
          row-key="nome"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import { computed } from 'vue'

const auth = useAuthStore()

const columnsPermissoes = [
  { name: 'nome', label: 'Permissão', field: 'nome', align: 'left' },
  { name: 'nivel', label: 'Possui?', field: 'nivel', align: 'center', format: val => val ? 'Sim' : 'Não' }
]

const rowsPermissoes = computed(() => [
  { nome: 'Manutenção', nivel: auth.permissoes?.manutencao },
  { nome: 'Acesso', nivel: auth.permissoes?.acesso },
  { nome: 'Análise', nivel: auth.permissoes?.analise },
  { nome: 'Solicitação Senha Análise', nivel: auth.permissoes?.solicitacaoSenhaAnalise },
  { nome: 'Proposta Acesso', nivel: auth.permissoes?.propostaAcesso },
  { nome: 'Proposta Análise', nivel: auth.permissoes?.propostaAnalise },
  { nome: 'Proposta Deletar', nivel: auth.permissoes?.propostaDeletar },
  { nome: 'Loja', nivel: auth.permissoes?.loja },
  { nome: 'Parâmetros', nivel: auth.permissoes?.parametros },
  { nome: 'Manutenção Cliente', nivel: auth.permissoes?.manutencaoCliente },
  { nome: 'Pix/Baixa Manual', nivel: auth.permissoes?.ordemPagamentoBaixaManual },
  { nome: 'Edição Loja', nivel: auth.permissoes?.lojaEdicao },
  { nome: 'Campanha Quitação Dívida', nivel: auth.permissoes?.campanhaQuitacaoDivida },
])

const columnsEstabelecimentos = [
  { name: 'NomeEstabelecimento', label: 'Nome', field: 'NomeEstabelecimento', align: 'left' },
  { name: 'CnpjEstabelecimento', label: 'CNPJ', field: 'CnpjEstabelecimento', align: 'left' },
  { name: 'CidadeEstabelecimento', label: 'Cidade', field: 'CidadeEstabelecimento', align: 'left' },
  { name: 'CodigoEstabelecimento', label: 'Código', field: 'CodigoEstabelecimento', align: 'center' },
  { name: 'TipoEstabelecimento', label: 'Tipo', field: 'TipoEstabelecimento', align: 'center' }
]
</script>

<style scoped>
</style>
