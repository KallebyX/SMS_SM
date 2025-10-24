import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle,
  Users,
  Search,
  Plus,
  Phone,
  Video,
  Settings,
  Paperclip,
  Smile,
  Send,
  MoreVertical,
  UserPlus,
  Archive,
  Bell,
  BellOff
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'

const Chat: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState('1')
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const chats = [
    {
      id: '1',
      type: 'direct',
      name: 'Dr. Maria Silva',
      avatar: '/avatars/maria.jpg',
      lastMessage: 'Precisamos revisar o protocolo de segurança',
      lastMessageTime: '14:30',
      unreadCount: 2,
      online: true,
      department: 'Cardiologia'
    },
    {
      id: '2',
      type: 'group',
      name: 'Equipe UTI',
      avatar: '/groups/uti.jpg',
      lastMessage: 'João Santos: Reunião às 16h hoje',
      lastMessageTime: '13:45',
      unreadCount: 5,
      participants: 8,
      department: 'UTI'
    },
    {
      id: '3',
      type: 'direct',
      name: 'Ana Costa',
      avatar: '/avatars/ana.jpg',
      lastMessage: 'Documento enviado ✓',
      lastMessageTime: '12:20',
      unreadCount: 0,
      online: false,
      department: 'Administração'
    },
    {
      id: '4',
      type: 'group',
      name: 'Enfermagem Noturna',
      avatar: '/groups/enfermagem.jpg',
      lastMessage: 'Sofia: Checklist completo',
      lastMessageTime: '11:15',
      unreadCount: 1,
      participants: 12,
      department: 'Enfermagem'
    },
    {
      id: '5',
      type: 'direct',
      name: 'Dr. Pedro Lima',
      avatar: '/avatars/pedro.jpg',
      lastMessage: 'Obrigado pela consulta!',
      lastMessageTime: 'Ontem',
      unreadCount: 0,
      online: true,
      department: 'Neurologia'
    }
  ]

  const messages = [
    {
      id: '1',
      senderId: '2',
      senderName: 'Dr. Maria Silva',
      senderAvatar: '/avatars/maria.jpg',
      content: 'Olá, bom dia! Podemos revisar o protocolo de segurança do paciente?',
      timestamp: '09:30',
      type: 'text'
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'Você',
      content: 'Bom dia, Dra. Maria! Claro, vou preparar os documentos.',
      timestamp: '09:32',
      type: 'text'
    },
    {
      id: '3',
      senderId: '2',
      senderName: 'Dr. Maria Silva',
      senderAvatar: '/avatars/maria.jpg',
      content: 'Perfeito! Também precisamos incluir as novas diretrizes da ANVISA.',
      timestamp: '09:35',
      type: 'text'
    },
    {
      id: '4',
      senderId: '2',
      senderName: 'Dr. Maria Silva',
      senderAvatar: '/avatars/maria.jpg',
      content: 'protocolo-seguranca-v2.pdf',
      timestamp: '09:37',
      type: 'file',
      fileName: 'protocolo-seguranca-v2.pdf',
      fileSize: '2.4 MB'
    },
    {
      id: '5',
      senderId: 'me',
      senderName: 'Você',
      content: 'Recebi o arquivo. Vou revisar e te retorno até às 14h.',
      timestamp: '09:40',
      type: 'text'
    },
    {
      id: '6',
      senderId: '2',
      senderName: 'Dr. Maria Silva',
      senderAvatar: '/avatars/maria.jpg',
      content: 'Precisamos revisar o protocolo de segurança urgente.',
      timestamp: '14:30',
      type: 'text'
    }
  ]

  const currentChat = chats.find(chat => chat.id === selectedChat)
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow-md overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Conversas</h1>
            <Button size="sm" className="bg-maternar-blue-600">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maternar-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`p-4 cursor-pointer border-b border-gray-100 ${
                selectedChat === chat.id ? 'bg-blue-50 border-r-4 border-r-maternar-blue-600' : ''
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar
                    src={chat.avatar}
                    alt={chat.name}
                    fallback={chat.name}
                    size="md"
                  />
                  {chat.type === 'direct' && chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                  {chat.type === 'group' && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-maternar-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs ml-2">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {chat.department}
                    {chat.type === 'group' && ` • ${chat.participants} membros`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={currentChat.avatar}
                    alt={currentChat.name}
                    fallback={currentChat.name}
                    size="sm"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentChat.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {currentChat.type === 'direct' ? (
                        <>
                          {currentChat.online ? (
                            <span className="text-maternar-green-600">Online</span>
                          ) : (
                            'Última vez: 2h atrás'
                          )}
                        </>
                      ) : (
                        `${currentChat.participants} membros`
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-2 max-w-xs lg:max-w-md ${
                    msg.senderId === 'me' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {msg.senderId !== 'me' && (
                      <Avatar
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        fallback={msg.senderName}
                        size="xs"
                      />
                    )}
                    
                    <div className={`rounded-lg p-3 ${
                      msg.senderId === 'me'
                        ? 'bg-maternar-blue-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm'
                    }`}>
                      {msg.type === 'text' ? (
                        <p className="text-sm">{msg.content}</p>
                      ) : msg.type === 'file' ? (
                        <div className="flex items-center space-x-2">
                          <Paperclip className="w-4 h-4" />
                          <div>
                            <p className="text-sm font-medium">{msg.fileName}</p>
                            <p className="text-xs opacity-75">{msg.fileSize}</p>
                          </div>
                        </div>
                      ) : null}
                      
                      <p className={`text-xs mt-1 ${
                        msg.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-5 h-5" />
                </Button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-maternar-blue-500 focus:border-transparent"
                    rows={1}
                  />
                </div>
                
                <Button variant="ghost" size="sm">
                  <Smile className="w-5 h-5" />
                </Button>
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-maternar-blue-600"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-gray-600">
                Escolha uma conversa da lista para começar a conversar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat