import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

import { Button } from '../components/ui/Button'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <AlertTriangle className="h-12 w-12 text-red-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida para outro local.
        </p>
        
        <div className="space-x-4">
          <Button onClick={() => window.history.back()}>
            Voltar
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            Ir para Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound