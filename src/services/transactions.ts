import { api } from './api'

export interface Transaction {
  cod_etapa: string
  descricao: string
  doc_origem: string
  doc_destino: string | null
  timestamp: string
  erro_string: string | null
  aguardando_reprocessamento: boolean
}

export interface TransactionListParams {
  count?: number
  skip?: number
  cod_etapa?: string
  sort_by?: string
}

export interface CreateTransactionDTO {
  code: string
  description: string
  sourceDoc: string
  targetDoc: string
}

export interface UpdateTransactionDTO {
  cod_etapa: Transaction['cod_etapa']
  description?: string
}

const API_PATH = 'AribaBetter/TransactionTracker'

export const TransactionsService = {
  // Listar transações com paginação e filtros
  list: async (params: TransactionListParams = {}) => {
    const response = await api.get('/api/proxy', {
      params: {
        path: API_PATH,
        ...params
      }
    })
    return response.data
  },

  // Buscar linha do tempo de uma transação específica
  getTimelineById: async (id: string) => {
    const response = await api.get('/api/proxy', {
      params: {
        path: API_PATH,
        id
      }
    })
    return response.data
  },

  // Método para obter lista com ordenação padrão
  getLatestTransactions: async (count: number = 10) => {
    const response = await api.get('/api/proxy', {
      params: {
        path: API_PATH,
        count,
        sort_by: '-sequencia,-timestamp'
      }
    })
    return response.data
  },

  // Buscar uma transação específica
  getById: async (id: string) => {
    const response = await api.get<Transaction>(`/transactions/${id}`)
    return response.data
  },

  // Criar uma nova transação
  create: async (data: CreateTransactionDTO) => {
    const response = await api.post<Transaction>('/transactions', data)
    return response.data
  },

  // Atualizar uma transação
  update: async (id: string, data: UpdateTransactionDTO) => {
    const response = await api.patch<Transaction>(`/transactions/${id}`, data)
    return response.data
  },

  // Deletar uma transação
  delete: async (id: string) => {
    await api.delete(`/transactions/${id}`)
  },

  // Buscar transações por período
  listByPeriod: async (startDate: string, endDate: string) => {
    const response = await api.get<Transaction[]>('/transactions/period', {
      params: {
        startDate,
        endDate,
      },
    })
    return response.data
  },

  // Reprocessar uma transação
  reprocess: async (cod_etapa: string) => {
    const response = await api.post('/api/proxy', {
      cod_etapa
    }, {
      params: {
        path: `${API_PATH}/reprocess`
      }
    })
    return response.data
  }
} 