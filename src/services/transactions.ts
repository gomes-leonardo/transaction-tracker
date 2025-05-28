import { api } from './api'

export interface Transaction {
  id: string
  code: string
  description: string
  sourceDoc: string
  targetDoc: string
  status: 'pending' | 'completed' | 'error'
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionDTO {
  code: string
  description: string
  sourceDoc: string
  targetDoc: string
}

export interface UpdateTransactionDTO {
  status: Transaction['status']
  description?: string
}

export const TransactionsService = {
  // Listar todas as transações
  list: async () => {
    const response = await api.get<Transaction[]>('/transactions')
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

  // Buscar transações por status
  listByStatus: async (status: Transaction['status']) => {
    const response = await api.get<Transaction[]>(`/transactions/status/${status}`)
    return response.data
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
} 