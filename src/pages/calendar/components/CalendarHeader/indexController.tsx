import { useState } from 'react';

export const useCalendarHeaderController = () => {
  const [searchValue, setSearchValue] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const handleNewActivity = () => {
    // Aqui você pode abrir um modal ou redirecionar para uma página de criação
    console.log('Nova atividade acionada');
  };

  return {
    searchValue,
    setSearchValue,
    disciplineFilter,
    setDisciplineFilter,
    typeFilter,
    setTypeFilter,
    handleNewActivity
  };
};
