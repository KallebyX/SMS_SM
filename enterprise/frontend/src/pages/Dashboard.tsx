import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Dashboard SMS-SM
      </h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Sistema Funcionando!</h2>
        <p className="text-gray-600">
          O frontend está carregando corretamente. Todos os componentes estão funcionais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900">Usuários</h3>
          <p className="text-2xl font-bold text-blue-600">1,234</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-medium text-green-900">Treinamentos</h3>
          <p className="text-2xl font-bold text-green-600">89</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-medium text-purple-900">Projetos</h3>
          <p className="text-2xl font-bold text-purple-600">23</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
