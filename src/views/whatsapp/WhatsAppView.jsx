import React, { useState, useEffect } from 'react';
import { whatsappService } from '../../services/whatsappService';
import { useWhatsAppSocket } from '../../hooks/useWhatsAppSocket';
import QRCode from 'qrcode';
import styles from './WhatsAppView.module.css';

function WhatsAppView() {
    const [instanceName, setInstanceName] = useState('tauro_whatsapp');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [qrCodeImage, setQrCodeImage] = useState(null);

    const { qrCode, connectionStatus, isConnecting, updateConnectionStatus } = useWhatsAppSocket(instanceName);

    useEffect(() => {
        const initializeStatus = async () => {
            await loadInstanceName();
            const statusData = await loadStatus();
            if (statusData && statusData.status) {
                updateConnectionStatus(statusData.status);
            }
        };
        initializeStatus();
    }, []);

    useEffect(() => {
        if (qrCode) {
            generateQRCodeImage(qrCode);
        } else {
            setQrCodeImage(null);
        }
    }, [qrCode]);

    const loadInstanceName = async () => {
        try {
            const data = await whatsappService.getInstanceName();
            if (data.instanceName) {
                setInstanceName(data.instanceName);
            }
        } catch (err) {
            console.error('Error loading instance name:', err);
        }
    };

    const loadStatus = async () => {
        try {
            setLoading(true);
            const data = await whatsappService.getStatus();
            setStatus(data);
            if (data && data.status) {
                updateConnectionStatus(data.status);
            }
            setError(null);
            return data;
        } catch (err) {
            setError('Error al cargar el estado de WhatsApp');
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        try {
            setLoading(true);
            setError(null);
            await whatsappService.connect();
            await loadStatus();
        } catch (err) {
            setError('Error al conectar con WhatsApp');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const generateQRCodeImage = async (qrText) => {
        try {
            const qrDataUrl = await QRCode.toDataURL(qrText, {
                width: 300,
                margin: 2,
            });
            setQrCodeImage(qrDataUrl);
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    };

    const getStatusColor = () => {
        const currentStatus = connectionStatus || status?.status || 'disconnected';
        switch (currentStatus) {
            case 'connected':
                return '#4caf50';
            case 'connecting':
                return '#ff9800';
            case 'disconnected':
                return '#f44336';
            default:
                return '#9e9e9e';
        }
    };

    const getStatusText = () => {
        const currentStatus = connectionStatus || status?.status || 'disconnected';
        switch (currentStatus) {
            case 'connected':
                return 'Conectado';
            case 'connecting':
                return 'Conectando...';
            case 'disconnected':
                return 'Desconectado';
            default:
                return 'Desconocido';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <i className="fab fa-whatsapp" style={{ fontSize: '2rem', color: '#25D366' }}></i>
                <h2>Conexión WhatsApp</h2>
            </div>

            {error && (
                <div className={styles.error}>
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}

            <div className={styles.statusCard}>
                <div className={styles.statusHeader}>
                    <h3>Estado de Conexión</h3>
                    <button onClick={loadStatus} className={styles.refreshButton} disabled={loading}>
                        <i className={`fas fa-sync-alt ${loading ? styles.spinning : ''}`}></i>
                    </button>
                </div>

                <div className={styles.statusIndicator}>
                    <div
                        className={styles.statusDot}
                        style={{ backgroundColor: getStatusColor() }}
                    ></div>
                    <span className={styles.statusText}>{getStatusText()}</span>
                    {isConnecting && <span className={styles.reconnecting}>(Reconectando...)</span>}
                </div>

                {status?.user && (
                    <div className={styles.userInfo}>
                        <p>
                            <strong>Usuario:</strong> {status.user.name || status.user.id}
                        </p>
                    </div>
                )}
            </div>

            {qrCodeImage && (
                <div className={styles.qrCard}>
                    <h3>Escanea el código QR</h3>
                    <p className={styles.qrInstructions}>
                        Abre WhatsApp en tu teléfono, ve a Configuración {'>'} Dispositivos vinculados {'>'} Vincular un dispositivo y escanea este código QR
                    </p>
                    <div className={styles.qrCodeContainer}>
                        <img src={qrCodeImage} alt="QR Code" className={styles.qrCode} />
                    </div>
                </div>
            )}

            {!qrCodeImage && connectionStatus !== 'connected' && (
                <div className={styles.actionCard}>
                    <p>Para conectar WhatsApp, haz clic en el botón de abajo.</p>
                    <button
                        onClick={handleConnect}
                        className={styles.connectButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Conectando...
                            </>
                        ) : (
                            <>
                                <i className="fab fa-whatsapp"></i> Conectar WhatsApp
                            </>
                        )}
                    </button>
                </div>
            )}

            {connectionStatus === 'connected' && (
                <div className={styles.successCard}>
                    <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#4caf50' }}></i>
                    <h3>¡WhatsApp Conectado!</h3>
                    <p>Tu instancia de WhatsApp está activa y lista para enviar mensajes.</p>
                </div>
            )}
        </div>
    );
}

export default WhatsAppView;
