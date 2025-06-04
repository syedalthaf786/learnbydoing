// import { useCallback } from 'react';
// import { useProjects } from '../context/ProjectContext';
// import { getProjects, addProject as addProjectService } from '../services/projectService';

// export function useProjectActions() {
//   const { dispatch } = useProjects();

//   const fetchProjects = useCallback(async () => {
//     dispatch({ type: 'SET_LOADING', payload: true });
//     try {
//       const data = await getProjects();
//       dispatch({ type: 'SET_PROJECTS', payload: data });
//     } catch (error) {
//       dispatch({ type: 'SET_ERROR', payload: error.message });
//     } finally {
//       dispatch({ type: 'SET_LOADING', payload: false });
//     }
//   }, [dispatch]);

//   const addProject = useCallback(async (project) => {
//     dispatch({ type: 'SET_LOADING', payload: true });
//     try {
//       const data = await addProjectService(project);
//       dispatch({ type: 'ADD_PROJECT', payload: data });
//       return data;
//     } catch (error) {
//       dispatch({ type: 'SET_ERROR', payload: error.message });
//       throw error;
//     } finally {
//       dispatch({ type: 'SET_LOADING', payload: false });
//     }
//   }, [dispatch]);

//   return {
//     fetchProjects,
//     addProject
//   };
// }