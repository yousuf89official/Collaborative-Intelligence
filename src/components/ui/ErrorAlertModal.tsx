'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from './dialog';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';

interface ErrorAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onRetry?: () => void;
}

export function ErrorAlertModal({
    isOpen,
    onClose,
    title,
    message,
    onRetry,
}: ErrorAlertModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-brand-surface border-brand-border text-brand-text-primary">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-500/10 border border-red-500/20">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-brand-text-primary">
                            {title}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-400 mt-2">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start gap-2 mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex-1 bg-brand-surface-highlight hover:bg-brand-border text-white"
                        onClick={onClose}
                    >
                        Dismiss
                    </Button>
                    {onRetry && (
                        <Button
                            type="button"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => {
                                onRetry();
                                onClose();
                            }}
                        >
                            Retry
                        </Button>
                    )}
                    <Button
                        type="button"
                        className="flex-1 bg-[#0D9488] hover:bg-[#0F766E] text-white"
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        Reload App
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
