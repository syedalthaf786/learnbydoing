import { useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';

export function useProjectFilters() {
  const { state, dispatch } = useProjects();
  const { projects, filters } = state;

  useEffect(() => {
    const filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          project.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === 'All' || project.category === filters.category;
      
      const matchesStatus = filters.status === 'All' || 
                           (filters.status === 'Completed' && project.completed) ||
                           (filters.status === 'In Progress' && !project.completed);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    dispatch({ type: 'SET_FILTERED_PROJECTS', payload: filtered });
  }, [projects, filters, dispatch]);

  return {
    filteredProjects: state.filteredProjects,
    filters: state.filters,
    updateFilters: (newFilters) => dispatch({ 
      type: 'UPDATE_FILTERS', 
      payload: newFilters 
    })
  };
}