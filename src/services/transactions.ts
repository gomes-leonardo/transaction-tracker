import { api } from './api'

export interface Transaction {
  cod_etapa: string
  descricao: string
  doc_origem: string
  doc_destino: string | null
  timestamp: string
  erro_string: string | null
  aguardando_reprocessamento: boolean
  sequencia?: number
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
  cod_etapa: string
  description?: string
}

const API_PATH = '/api/proxy'
const TRANSACTION_PATH = 'AribaBetter/TransactionTracker'

export const TransactionsService = {
  list: async (params: TransactionListParams = {}) => {
    const query = {
      ...params,
      sort_by: params.sort_by || '-sequencia,-timestamp',
      path: TRANSACTION_PATH
    }

    const response = await api.get(API_PATH, { params: query })
    return response.data
  },

  getTimelineById: async (id: string) => {
    const response = await api.get(API_PATH, {
      params: {
        path: TRANSACTION_PATH,
        id
      }
    })
    return response.data
  },

  create: async (data: CreateTransactionDTO) => {
    const response = await api.post(`${API_PATH}?path=${TRANSACTION_PATH}`, data)
    return response.data
  },

  update: async (id: string, data: UpdateTransactionDTO) => {
    const response = await api.post(`${API_PATH}?path=${TRANSACTION_PATH}/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.post(`${API_PATH}?path=${TRANSACTION_PATH}/${id}/delete`, {})
    return response.data
  },

  reprocess: async (cod_etapa: string) => {
    const response = await api.post(`${API_PATH}?path=${TRANSACTION_PATH}/${cod_etapa}/reprocess`, {})
    return response.data
  },

  listByPeriod: async (startDate: string, endDate: string) => {
    const response = await api.get(API_PATH, {
      params: {
        path: TRANSACTION_PATH,
        startDate,
        endDate
      }
    })
    return response.data
  }
}
