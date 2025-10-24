import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  'pt-BR': {
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      cancel: 'Cancelar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      view: 'Visualizar',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      search: 'Buscar',
      filter: 'Filtrar',
      export: 'Exportar',
      import: 'Importar',
      print: 'Imprimir',
      refresh: 'Atualizar'
    },
    navigation: {
      dashboard: 'Dashboard',
      projects: 'Projetos',
      users: 'Usuários',
      calendar: 'Calendário',
      documents: 'Documentos',
      training: 'Treinamentos',
      analytics: 'Analytics',
      settings: 'Configurações'
    }
  },
  'en-US': {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      print: 'Print',
      refresh: 'Refresh'
    },
    navigation: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      users: 'Users',
      calendar: 'Calendar',
      documents: 'Documents',
      training: 'Training',
      analytics: 'Analytics',
      settings: 'Settings'
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt-BR',
    lng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n