import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-maternar-blue-700 mb-2">
          Dashboard - Maternar Santa Mariense
        </h1>
        <p className="text-maternar-gray-600">
          Visão geral de suas atividades e métricas
        </p>
      </div>
      
      <Card className="p-6 mb-6 border-l-4 border-maternar-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-maternar-blue-700 mb-2">
              🎉 Sistema Funcionando!
            </h2>
            <p className="text-maternar-gray-600">
              O Maternar Santa Mariense está carregando corretamente. Todas as funcionalidades estão prontas.
            </p>
          </div>
          <Badge variant="success" className="text-sm">
            Online
          </Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-maternar-blue-50 to-white p-6 border-t-4 border-maternar-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-maternar-blue-900">Usuários Ativos</h3>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-3xl font-bold text-maternar-blue-600">1,234</p>
          <p className="text-sm text-maternar-gray-600 mt-1">+12% este mês</p>
        </Card>
        
        <Card className="bg-gradient-to-br from-maternar-green-50 to-white p-6 border-t-4 border-maternar-green-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-maternar-green-900">Cursos Ativos</h3>
            <span className="text-2xl">📚</span>
          </div>
          <p className="text-3xl font-bold text-maternar-green-600">89</p>
          <p className="text-sm text-maternar-gray-600 mt-1">+5 novos cursos</p>
        </Card>
        
        <Card className="bg-gradient-to-br from-maternar-pink-50 to-white p-6 border-t-4 border-maternar-pink-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-maternar-pink-900">Projetos</h3>
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-3xl font-bold text-maternar-pink-600">23</p>
          <p className="text-sm text-maternar-gray-600 mt-1">7 em andamento</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
