import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

const SIGNALR_URL = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_WHATSAPP_HUB || '/signalr/whatsapp'
    }`;

export const useWhatsAppSocket = (instanceName) => {
    const [connection, setConnection] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        if (!instanceName) return;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(SIGNALR_URL)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [instanceName]);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    console.log('Connected to WhatsApp SignalR hub');
                    setIsConnecting(false);

                    connection.invoke('JoinInstance', instanceName);

                    connection.on('ReceiveQrCode', (qr) => {
                        console.log('QR Code received');
                        setQrCode(qr);
                    });

                    connection.on('ReceiveConnectionStatus', (status, session) => {
                        console.log('Connection status:', status);
                        setConnectionStatus(status);

                        if (status === 'connected') {
                            setQrCode(null);
                        }
                    });
                })
                .catch((error) => {
                    console.error('Error connecting to SignalR:', error);
                    setIsConnecting(false);
                });

            connection.onreconnecting(() => {
                console.log('Reconnecting to SignalR...');
                setIsConnecting(true);
            });

            connection.onreconnected(() => {
                console.log('Reconnected to SignalR');
                setIsConnecting(false);
                connection.invoke('JoinInstance', instanceName);
            });

            connection.onclose(() => {
                console.log('SignalR connection closed');
                setIsConnecting(false);
            });
        }
    }, [connection, instanceName]);

    const clearQrCode = useCallback(() => {
        setQrCode(null);
    }, []);

    const updateConnectionStatus = useCallback((status) => {
        setConnectionStatus(status);
    }, []);

    return {
        qrCode,
        connectionStatus,
        isConnecting,
        clearQrCode,
        updateConnectionStatus,
    };
};
