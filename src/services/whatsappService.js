import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const whatsappService = {
    async getStatus() {
        try {
            const response = await axios.get(`${apiUrl}/api/whatsapp/status`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error('Error getting WhatsApp status:', error);
            throw error;
        }
    },

    async connect() {
        try {
            const response = await axios.post(`${apiUrl}/api/whatsapp/connect`, null, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error('Error connecting to WhatsApp:', error);
            throw error;
        }
    },

    async sendMessage(to, message) {
        try {
            const response = await axios.post(`${apiUrl}/api/whatsapp/send`, {
                to,
                message,
            }, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw error;
        }
    },

    async getInstanceName() {
        try {
            const response = await axios.get(`${apiUrl}/api/whatsapp/instance-name`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error('Error getting instance name:', error);
            throw error;
        }
    },
};
