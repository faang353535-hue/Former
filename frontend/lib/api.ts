import axios from 'axios';

const API_URL = 'http://localhost:5000';

interface Card {
    id: number;
    form_data: {
        name: string;
        fields: {
            id: number;
            title: string;
            type: string;
            rating?: number;
        }[];
        fontColor?: string;
        backgroundColor: string;
    };
}

type UpdatePayload = {
    id: number;
    form_data: Card['form_data'];
};


export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const authApi = {
    
    login: async (email: string, password: string) => {
        const response = await api.post('/user/login', { email, password });
        return response.data;
    },

    register: async (firstName: string, lastName: string, email: string, password: string) => {
        const response = await api.post('/user/register', {
            firstName,
            lastName,
            email,
            password,
        });
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },

    updateProfile: async (data: { firstName: string; lastName: string }) => {
        const response = await api.put('/user/update', data);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/user/logout');
        return response.data;
    },

    formCreate: async (formData: any) => {
        const response = await api.post('/user/create', formData);
        console.log(response);
        return response.data;
    },

    getForms: async () => {
        const response = await api.get('/user/forms');
        return response.data;
    },

    updateForm: async (id: number, updatePayload: UpdatePayload) => {
        const response = await api.put(`/user/updateForm/${id}`, updatePayload);
        return response.data;
    },

    getForm: async (id: number) => {
        const response = await api.get(`/user/form/${id}`);
        return response.data;
    },

    getResponse: async (data: any) => {
        const response = await api.post(`/user/response`, data)
        return response.data;
    },

    formResponses: async (formId: string) => {
        const response = await api.get(`/user/responses/${formId}`);
        return response.data;
    },

    deleteForms: async (formIds: number[]) => {
        const response = await api.delete('/user/delete', { data: { ids: formIds } });
        return response.data;
    },

    checkAuth: async () => {
        try {
            const profile = await authApi.getProfile();
            return profile;
        } catch (error) {
            return false;
        }
    },

};