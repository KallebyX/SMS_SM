import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useToast } from '../ui/Toast'

interface CreateLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (link: any) => void
}

export const CreateLinkModal: React.FC<CreateLinkModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'SYSTEM'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newLink = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString()
      }

      showToast({
        type: 'success',
        title: 'Link criado!',
        message: `${formData.title} foi adicionado aos links úteis.`
      })

      onSuccess?.(newLink)
      onClose()
      
      setFormData({
        title: '',
        url: '',
        description: '',
        category: 'SYSTEM'
      })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro ao criar link',
        message: 'Não foi possível criar o link. Tente novamente.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Link"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adicionando...' : 'Adicionar Link'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maternar-blue-500"
            placeholder="Ex: Portal Maternar"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL *
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maternar-blue-500"
            placeholder="https://exemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maternar-blue-500"
            placeholder="Breve descrição do link..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maternar-blue-500"
          >
            <option value="SYSTEM">Sistema</option>
            <option value="TRAINING">Treinamento</option>
            <option value="SUPPORT">Suporte</option>
            <option value="EXTERNAL">Externo</option>
          </select>
        </div>
      </form>
    </Modal>
  )
}

