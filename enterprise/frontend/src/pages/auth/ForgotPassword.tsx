import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maternar-blue-50 to-maternar-green-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email Enviado!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Enviamos instruções para redefinir sua senha para <strong>{email}</strong>. 
              Verifique sua caixa de entrada e siga as instruções.
            </p>
            
            <div className="space-y-4">
              <Link to="/auth/login">
                <Button className="w-full">
                  Voltar para Login
                </Button>
              </Link>
              
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-sm text-maternar-blue-600 hover:text-maternar-blue-700"
              >
                Não recebeu o email? Tentar novamente
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maternar-blue-50 to-maternar-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Esqueceu a senha?
            </h1>
            <p className="text-gray-600">
              Digite seu email para receber instruções de redefinição de senha
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-maternar-blue-500 focus:border-maternar-blue-500"
                  placeholder="seu.email@maternarsm.com.br"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Instruções'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/auth/login"
              className="inline-flex items-center text-sm text-maternar-blue-600 hover:text-maternar-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default ForgotPassword