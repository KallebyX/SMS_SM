import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title: string
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [totalPages] = useState(5) // Mock - would come from PDF

  const handleDownload = () => {
    // Create a temporary link and trigger download
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${title}.pdf`
    link.click()
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="full"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      }
    >
      <div className="bg-gray-100 rounded-lg p-4 min-h-[600px] flex items-center justify-center">
        {/* Mock PDF viewer - In production, use react-pdf or iframe */}
        <div 
          className="bg-white shadow-lg rounded-lg overflow-hidden"
          style={{ 
            width: `${zoom}%`,
            maxWidth: '100%'
          }}
        >
          <div className="aspect-[8.5/11] bg-white p-8">
            <div className="h-full border border-gray-200 rounded p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Este é um visualizador de PDF mockado. Em produção, aqui seria renderizado
                  o conteúdo real do PDF usando a biblioteca react-pdf ou um iframe.
                </p>
                <p className="font-semibold">Conteúdo da Política:</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
                  ut aliquip ex ea commodo consequat.
                </p>
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Página {currentPage} de {totalPages}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// Simple inline PDF viewer for quick preview
interface InlinePDFViewerProps {
  pdfUrl: string
  height?: string
}

export const InlinePDFViewer: React.FC<InlinePDFViewerProps> = ({
  pdfUrl,
  height = '600px'
}) => {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height }}>
      <iframe
        src={pdfUrl}
        className="w-full h-full"
        title="PDF Viewer"
      />
    </div>
  )
}

