import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Icon } from "@workspace/ui/components/icon";
import { useState } from "react";
import { failureTemplates } from "../_constants";

interface StatusUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (note?: string) => void;
    previousStatus: string;
    targetStatus: string;
}

export function StatusUpdateModal({ isOpen, onClose, onConfirm, previousStatus, targetStatus }: StatusUpdateModalProps) {
    const [step, setStep] = useState<"reason" | "confirm">("reason");
    const [note, setNote] = useState("");

    const handleTemplateClick = (text: string) => {
        setNote(text.replace(/\.+$/, ''));
    };

    const handleProceed = () => {
        if (!note) {
            alert("Mohon isi alasan.");
            return;
        }
        setStep("confirm");
    };

    const handleSubmit = () => {
        onConfirm(note);
        setStep("reason"); // Reset step
        setNote(""); // Reset note
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden bg-white">
                {step === "reason" ? (
                    <>
                        <DialogHeader className="border-b p-4 relative flex items-center justify-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full hover:bg-gray-100"
                                onClick={onClose}
                            >
                                <Icon icon="lucide:arrow-left" className="h-5 w-5" />
                            </Button>
                            <DialogTitle className="text-lg font-bold">Status Kirim</DialogTitle>
                        </DialogHeader>

                        <div className="p-6 space-y-6">
                            <h2 className="text-xl font-bold text-red-600 text-center">Status Gagal Kirim</h2>

                            <div className="space-y-4">
                                <p className="font-semibold text-sm">Berikan Deskripsi Status Pengiriman</p>

                                <div className="space-y-2">
                                    <span className="text-xs text-gray-500">Templat deskripsi:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {failureTemplates.map(template => (
                                            <button
                                                key={template}
                                                onClick={() => handleTemplateClick(template)}
                                                className="rounded-full border border-green-600 px-3 py-1 text-xs font-semibold text-green-700 bg-white hover:bg-green-50 transition-colors"
                                            >
                                                {template}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Textarea
                                    placeholder="Masukkan Deskripsi"
                                    className="min-h-[120px] rounded-xl border-gray-300 resize-none focus-visible:ring-1 focus-visible:ring-green-600"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={handleProceed}
                                className="w-full bg-[#1E8F59] hover:bg-[#166E45] text-white rounded-xl py-6 text-base font-semibold"
                            >
                                Ubah Status Pengiriman
                            </Button>
                        </div>
                    </>
                ) : (
                    // Confirmation Step
                    <div className="p-8 flex flex-col items-center text-center space-y-6">
                        <h2 className="text-xl font-bold">Apakah anda yakin ingin mengubahnya?</h2>

                        <div className="w-full h-px bg-gray-200"></div>

                        <div className="w-full bg-yellow-100 rounded-xl p-6 flex flex-col items-center justify-center space-y-2 border border-yellow-200">
                            <span className="text-yellow-700 font-medium">Perubahan:</span>
                            <div className="bg-white rounded-full px-4 py-2 border border-gray-300 shadow-sm flex items-center gap-2 text-sm font-semibold">
                                <span className="text-blue-600">{previousStatus}</span>
                                <Icon icon="lucide:arrow-right" className="h-4 w-4 text-gray-400" />
                                <span className="text-red-600">Gagal Kirim</span>
                            </div>
                        </div>

                        <div className="flex w-full gap-4 pt-4">
                            <Button
                                variant="destructive"
                                className="flex-1 rounded-xl py-6 bg-[#D32F2F] hover:bg-[#B71C1C]"
                                onClick={() => setStep("reason")}
                            >
                                Tidak
                            </Button>
                            <Button
                                className="flex-1 rounded-xl py-6 bg-[#1E8F59] hover:bg-[#166E45] text-white"
                                onClick={handleSubmit}
                            >
                                Ya
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
