import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useState, useEffect } from "react";

interface CourierInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string, phone: string) => void;
}

export function CourierInputModal({ isOpen, onClose, onConfirm }: CourierInputModalProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setName("");
            setPhone("");
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Input Data Kurir</DialogTitle>
                    <DialogDescription>
                        Masukkan identitas kurir yang akan mengirim paket ini.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Kurir</label>
                        <Input
                            placeholder="Nama Lengkap Kurir"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">No. Telepon / WhatsApp</label>
                        <Input
                            placeholder="08..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!name || !phone}
                        onClick={() => onConfirm(name, phone)}
                    >
                        Update & Kirim
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
