import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let csrfToken
let csrfRequest

export async function prepareMutation() {
  if (!csrfToken) {
    csrfRequest ??= api.get('/auth/csrf')
    try {
      const response = await csrfRequest
      csrfToken = response.data.token
    } finally {
      csrfRequest = undefined
    }
  }
  return { 'X-XSRF-TOKEN': csrfToken }
}

export async function mutate(method, path, data) {
  const headers = await prepareMutation()
  return api.request({ method, url: path, data, headers })
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.detail || error?.response?.data?.message || fallback
}

export default api
