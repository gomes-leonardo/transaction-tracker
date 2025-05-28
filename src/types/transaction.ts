export interface APITransaction {
  id: string
  id_processo: string
  processo: string
  cod_etapa: string
  sequencia: string
  doc_origem: string | null
  doc_destino: string | null
  timestamp: string
  processado_sucesso: boolean
  permite_reprocessar: boolean
  erro_string: string | null
  aguardando_reprocessamento: boolean
}

export interface TransactionDisplay {
  id_processo: string
  processo: string
  cod_etapa: string
  sequencia: string
  doc_origem: string | null
  doc_destino: string | null
  data: Date
  status: 'success' | 'error' | 'waiting'
  permite_reprocessar: boolean
  erro?: string
}

export const mapAPIToDisplayTransaction = (
  transaction: APITransaction
): TransactionDisplay => ({
  id_processo: transaction.id_processo,
  processo: transaction.processo,
  cod_etapa: transaction.cod_etapa,
  sequencia: transaction.sequencia,
  doc_origem: transaction.doc_origem,
  doc_destino: transaction.doc_destino,
  data: new Date(transaction.timestamp),
  status: transaction.aguardando_reprocessamento
    ? 'waiting'
    : transaction.processado_sucesso
    ? 'success'
    : 'error',
  permite_reprocessar: transaction.permite_reprocessar,
  erro: transaction.erro_string || undefined,
}) 