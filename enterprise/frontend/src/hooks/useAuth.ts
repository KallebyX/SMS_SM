import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN, REGISTER, LOGOUT } from '../graphql/mutations'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/providers/ToastProvider'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [loginMutation] = useMutation(LOGIN)
  const [registerMutation] = useMutation(REGISTER)
  const [logoutMutation] = useMutation(LOGOUT)

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data } = await loginMutation({
        variables: {
          input: { email, password }
        }
      })

      if (data.login.token) {
        localStorage.setItem('authToken', data.login.token)
        localStorage.setItem('user', JSON.stringify(data.login.user))
        
        showToast({
          type: 'success',
          title: 'Login realizado com sucesso!',
          message: `Bem-vindo, ${data.login.user.firstName}!`
        })

        navigate('/dashboard')
        return { success: true, user: data.login.user }
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro no login',
        message: error.message || 'Credenciais inválidas'
      })
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (input: any) => {
    setLoading(true)
    try {
      const { data } = await registerMutation({
        variables: { input }
      })

      if (data.register.token) {
        localStorage.setItem('authToken', data.register.token)
        localStorage.setItem('user', JSON.stringify(data.register.user))
        
        showToast({
          type: 'success',
          title: 'Conta criada com sucesso!',
          message: `Bem-vindo, ${data.register.user.firstName}!`
        })

        navigate('/dashboard')
        return { success: true, user: data.register.user }
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro ao criar conta',
        message: error.message || 'Dados inválidos'
      })
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutMutation()
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      navigate('/login')
    } catch (error: any) {
      console.error('Logout error:', error)
    }
  }

  return {
    login,
    register,
    logout,
    loading
  }
}

