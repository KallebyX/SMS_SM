import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useToast } from '../ui/Toast'

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
  onSuccess?: (event: any) => void
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSuccess
}) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'MEETING',
    location: '',
    startDate: selectedDate ? selectedDate.toISOString().slice(0, 16) : '',
    endDate: '',
    isAllDay: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdAt: new Date().toISOString()
      }

      showToast({
        type: 'success',
        title: 'Evento criado!',
        message: `${formData.title} foi adicionado ao calendário.`
      })

      onSuccess?.(newEvent)
      onClose()
      
      setFormData({
        title: '',
        description: '',
        type: 'MEETING',
        location: '',
        startDate: '',
        endDate: '',
        isAllDay: false
      })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro ao criar evento',
        message: 'Não foi possível criar o evento. Tente novamente.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Evento"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Criando...' : 'Criar Evento'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título do Evento *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maternar-blue-500"
            placeholder="Ex: Reunião de Equipe"
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
            placeholder="Adicione detalhes sobre o evento..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Evento
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maternar-blue-500"
            >
              <option value="MEETING">Reunião</option>
              <option value="TRAINING">Treinamento</option>
              <option value="DEADLINE">Prazo</option>
              <option value="HOLIDAY">Feriado</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Local
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maternar-blue-500"
              placeholder="Sala A, Online..."
            />
          </div>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isAllDay"
            checked={formData.isAllDay}
            onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
            className="h-4 w-4 text-maternar-blue-600 focus:ring-maternar-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isAllDay" className="ml-2 block text-sm text-gray-700">
            Evento de dia inteiro
          </label>
        </div>

        {!formData.isAllDay && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data/Hora de Início *
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maternar-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data/Hora de Término *
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maternar-blue-500"
                required
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}

