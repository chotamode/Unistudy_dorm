import axios from 'axios';

const CLICKUP_API_URL = 'https://api.clickup.com/api/v2';
const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;

if (!CLICKUP_API_KEY) {
    throw new Error('Missing ClickUp API key');
}

const clickupService = axios.create({
    baseURL: CLICKUP_API_URL,
    headers: {
        'Authorization': CLICKUP_API_KEY,
        'Content-Type': 'application/json'
    }
});

export const createTask = async (listId: string, taskData: any) => {
    try {
        const response = await clickupService.post(`/list/${listId}/task`, taskData);
        return response.data;
    } catch (error: any) {
        console.error('Error creating task:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateTask = async (taskId: string, fieldId: string, value: any) => {
    try {
        const response = await clickupService.post(`/task/${taskId}/field/${fieldId}`, { value });
        return response.data;
    } catch (error: any) {
        console.error('Error updating task:', error.response ? error.response.data : error.message);
        throw error;
    }
}