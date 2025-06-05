import axios from 'axios';

const API_URL = 'https://learnbydoing-1.onrender.com/api/projects';

export const fetchProjects = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const applyForRole = async (projectId, roleTitle, applicationText) => {
  console.log("Applying for role:", roleTitle, "in project:", projectId);

  try {
    const response = await axios.post(`${API_URL}/${projectId}/apply`, {
      role: roleTitle,
      application: applicationText
    });
    console.log("Role application response:", response.data);
    return response.data;

  } catch (error) {
    console.error('Error applying for role:', error);
    throw error;
  }
};
