import { useHttp } from '@inertiajs/react';
import { useCallback, useState } from 'react';

export const OTP_MAX_LENGTH = 6;

export const useTwoFactorAuth = () => {
    const { get } = useHttp();

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
            const { svg } = await get(route('two-factor.qr-code'));

            setQrCodeSvg(svg);
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch QR code']);
            setQrCodeSvg(null);
        }
    }, [get]);

    const fetchSetupKey = useCallback(async () => {
        try {
            const { secretKey: key } = await get(
                route('two-factor.secret-key'),
            );

            setManualSetupKey(key);
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch a setup key']);
            setManualSetupKey(null);
        }
    }, [get]);

    const fetchRecoveryCodes = useCallback(async () => {
        try {
            setErrors([]);
            const codes = await get(route('two-factor.recovery-codes'));
            setRecoveryCodesList(codes);
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch recovery codes']);
            setRecoveryCodesList([]);
        }
    }, [get]);

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
