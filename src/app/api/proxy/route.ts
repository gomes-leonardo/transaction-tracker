import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_BASE_URL = 'http://213.199.38.239:9000/api'
const AUTH_CREDENTIALS = Buffer.from('saga_demo_usinalins@sagaconsultoria-info.com:Saga@2024.01').toString('base64')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path') || ''
    const queryParams = new URLSearchParams()

    // Copiar todos os parâmetros exceto 'path'
    searchParams.forEach((value, key) => {
      if (key !== 'path') {
        queryParams.append(key, value)
      }
    })

    const targetUrl = `${API_BASE_URL}/${path}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    console.log('Requesting:', targetUrl)

    const response = await axios.get(targetUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH_CREDENTIALS}`
      }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Proxy error:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path') || ''
    const body = await request.json()

    const targetUrl = `${API_BASE_URL}/${path}`
    console.log('Posting to:', targetUrl)

    const response = await axios.post(targetUrl, body, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH_CREDENTIALS}`
      }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Proxy error:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.response?.status || 500 }
    )
  }
} 