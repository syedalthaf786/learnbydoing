import React, { createContext, useContext, useReducer } from 'react';

const ProjectContext = createContext();

const initialState = {
  projects: [],
  filteredProjects: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: 'All',
    status: 'All'
  }
};

function projectReducer(state, action) {
  switch (action.type) {
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
        filteredProjects: action.payload
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
        filteredProjects: [...state.projects, action.payload]
      };
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case 'SET_FILTERED_PROJECTS':
      return {
        ...state,
        filteredProjects: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}