import { useHttp } from '@inertiajs/react';
import { useCallback, useState } from 'react';
// import { qrCode, recoveryCodes, secretKey } from '@/routes/two-factor';

export const OTP_MAX_LENGTH = 6;

export const useTwoFactorAuth = () => {
    const { submit } = useHttp();

    const [qrCodeSvg, setQrCodeSvg] = useState(null);
    const [manualSetupKey, setManualSetupKey] = useState(null);
    const [recoveryCodesList, setRecoveryCodesList] = useState([]);
    const [errors, setErrors] = useState([]);

    const hasSetupData = qrCodeSvg !== null && manualSetupKey !== null;

    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);

    const clearSetupData = useCallback(() => {
        setManualSetupKey(null);
        setQrCodeSvg(null);
        setErrors([]);
    }, []);

    const clearTwoFactorAuthData = useCallback(() => {
        setManualSetupKey(null);
        setQrCodeSvg(null);
        setErrors([]);
        setRecoveryCodesList([]);
    }, []);

    const fetchQrCode = useCallback(async () => {
        try {
            const { svg } = await submit('/qr-url');

            setQrCodeSvg(svg);
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch QR code']);
            setQrCodeSvg(null);
        }
    }, [submit]);

    const fetchSetupKey = useCallback(async () => {
        try {
            const { secretKey: key } = await submit('/secret-url');

            setManualSetupKey(key);
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch a setup key']);
            setManualSetupKey(null);
        }
    }, [submit]);

    const fetchRecoveryCodes = useCallback(async () => {
        try {
            setErrors([]);
            const codes = await submit('/recovery-code');
            setRecoveryCodesList(codes);
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch recovery codes']);
            setRecoveryCodesList([]);
        }
    }, [submit]);

    const fetchSetupData = useCallback(async () => {
        try {
            setErrors([]);
            await Promise.all([fetchQrCode(), fetchSetupKey()]);
        } catch {
            setQrCodeSvg(null);
            setManualSetupKey(null);
        }
    }, [fetchQrCode, fetchSetupKey]);

    return {
        qrCodeSvg,
        manualSetupKey,
        recoveryCodesList,
        hasSetupData,
        errors,
        clearErrors,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchQrCode,
        fetchSetupKey,
        fetchSetupData,
        fetchRecoveryCodes,
    };
};
