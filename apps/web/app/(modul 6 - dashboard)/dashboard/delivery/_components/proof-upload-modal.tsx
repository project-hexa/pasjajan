import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import { useState, useEffect } from "react";

interface ProofUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (file: File) => void;
}

export function ProofUploadModal({ isOpen, onClose, onConfirm }: ProofUploadModalProps) {
    const [proofFile, setProofFile] = useState<File | null>(null);

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setProofFile(null);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Bukti Pengiriman</DialogTitle>
                    <DialogDescription>
                        Upload foto bukti bahwa paket telah sampai di tujuan.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setProofFile(e.target.files[0]);
                                }
                            }}
                        />
                        {proofFile ? (
                            <div className="space-y-2">
                                <Icon icon="lucide:check-circle" className="h-10 w-10 text-green-500 mx-auto" />
                                <p className="text-sm font-medium text-green-700">{proofFile.name}</p>
                                <p className="text-xs text-gray-400">Klik untuk ganti foto</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Icon icon="lucide:camera" className="h-10 w-10 text-gray-400 mx-auto" />
                                <p className="text-sm font-medium text-gray-600">Klik atau drop foto di sini</p>
                                <p className="text-xs text-gray-400">Format: JPG, PNG (Max 2MB)</p>
                            </div>
                        )}
                    </div>

                    <Button
                        className="w-full bg-[#1E8F59] hover:bg-[#166E45] text-white"
                        disabled={!proofFile}
                        onClick={() => proofFile && onConfirm(proofFile)}
                    >
                        Konfirmasi & Upload
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
