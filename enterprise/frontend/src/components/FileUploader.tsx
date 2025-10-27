import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, File, Image as ImageIcon, FileText, CheckCircle } from 'lucide-react'
import { useToast } from './ui/Toast'

interface FileUploaderProps {
  onUpload: (files: File[]) => void
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  multiple?: boolean
  preview?: boolean
  className?: string
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  accept = '*/*',
  maxSize = 10,
  maxFiles = 5,
  multiple = true,
  preview = true,
  className = ''
}) => {
  const { showToast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file size
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSize) {
      showToast({
        type: 'error',
        title: 'Arquivo muito grande',
        message: `${file.name} excede o tamanho máximo de ${maxSize}MB`
      })
      return false
    }

    // Check file type
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(t => t.trim())
      const fileType = file.type
      const fileExt = `.${file.name.split('.').pop()}`
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''))
        }
        return type === fileType || type === fileExt
      })

      if (!isAccepted) {
        showToast({
          type: 'error',
          title: 'Tipo de arquivo não aceito',
          message: `${file.name} não é um tipo de arquivo válido`
        })
        return false
      }
    }

    return true
  }

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return

    const fileArray = Array.from(newFiles)
    const validFiles = fileArray.filter(validateFile)

    if (files.length + validFiles.length > maxFiles) {
      showToast({
        type: 'warning',
        title: 'Limite excedido',
        message: `Você pode enviar no máximo ${maxFiles} arquivo(s)`
      })
      return
    }

    const updatedFiles = [...files, ...validFiles]
    setFiles(updatedFiles)

    // Generate previews for images
    if (preview) {
      validFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setPreviews(prev => [...prev, reader.result as string])
          }
          reader.readAsDataURL(file)
        }
      })
    }

    onUpload(updatedFiles)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    setPreviews(updatedPreviews)
    onUpload(updatedFiles)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return ImageIcon
    if (file.type.includes('pdf')) return FileText
    return File
  }

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-maternar-blue-500 bg-maternar-blue-50' 
            : 'border-gray-300 hover:border-maternar-blue-400 hover:bg-gray-50'
          }
        `}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-maternar-blue-500' : 'text-gray-400'}`} />
        <p className="text-sm font-medium text-gray-700 mb-1">
          Clique para selecionar ou arraste arquivos aqui
        </p>
        <p className="text-xs text-gray-500">
          Máximo {maxSize}MB por arquivo • Até {maxFiles} arquivo(s)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <AnimatePresence>
            {files.map((file, index) => {
              const Icon = getFileIcon(file)
              const isImage = file.type.startsWith('image/')
              
              return (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {/* Preview or Icon */}
                  {isImage && previews[index] ? (
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-500" />
                    </div>
                  )}

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  {/* Status */}
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// Avatar Uploader - Simplified for profile pictures
interface AvatarUploaderProps {
  currentAvatar?: string
  onUpload: (file: File) => void
  size?: 'sm' | 'md' | 'lg'
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  onUpload,
  size = 'lg'
}) => {
  const { showToast } = useToast()
  const [preview, setPreview] = useState<string | undefined>(currentAvatar)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (!file.type.startsWith('image/')) {
      showToast({
        type: 'error',
        title: 'Arquivo inválido',
        message: 'Por favor, selecione uma imagem'
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        type: 'error',
        title: 'Arquivo muito grande',
        message: 'A imagem deve ter no máximo 5MB'
      })
      return
    }

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    onUpload(file)
  }

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 cursor-pointer group relative`}
      >
        {preview ? (
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Upload className="w-6 h-6 text-white" />
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="text-xs text-gray-500 mt-2">Clique para alterar</p>
    </div>
  )
}

