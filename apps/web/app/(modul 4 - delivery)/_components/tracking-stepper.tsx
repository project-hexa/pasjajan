import Image from "next/image";
import { STEPS, STATUS_MAP, statusNotifications } from "../_constants";
import { formatStatusText } from "../_utils";

interface TrackingStepperProps {
    currentStatus: string;
}

export function TrackingStepper({ currentStatus }: TrackingStepperProps) {
    const activeIndex = STATUS_MAP[currentStatus] ?? 0;

    const getStepStatus = (index: number) => {
        if (index < activeIndex) return "completed";
        if (index === activeIndex) return "completed";
        return "pending";
    };

    return (
        <section className="mx-12 mt-8 rounded-2xl border border-[#CDE6D5] bg-[#EEF7F0] p-10 pb-16">
            <div className="relative flex justify-between items-start">
                {/* Line Background */}
                <div className="absolute top-12 right-[10%] left-[10%] z-10 h-[4px] bg-[#8AC79E]"></div>

                {/* Steps */}
                {STEPS.map((step, index) => {
                    const status = getStepStatus(index);
                    const isCompleted = status === "completed";

                    return (
                        <div key={index} className="relative flex flex-col items-center w-1/4 text-center z-20">
                            <div className={`p-2 rounded-full ${isCompleted ? 'bg-white' : 'bg-transparent'}`}>
                                <Image
                                    src={step.icon}
                                    alt={step.label}
                                    width={32}
                                    height={32}
                                    className={`h-8 w-8 ${!isCompleted ? "opacity-50 grayscale" : ""}`}
                                />
                            </div>

                            {/* Checkmark Circle */}
                            <div
                                className={`absolute h-5 w-5 rounded-full ${isCompleted ? "bg-[#0A6B3C]" : "bg-[#8AC79E]"} flex items-center justify-center`}
                                style={{ top: "48px", transform: "translateY(-50%)" }}
                            >
                                {isCompleted && <span className="text-white text-xs">✓</span>}
                            </div>

                            <p className={`text-sm font-semibold mt-16 ${isCompleted ? "text-[#0A6B3C]" : "text-[#8AC79E]"}`}>
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            <p className="mt-8 text-center text-xl font-bold text-[#0A6B3C]">
                {statusNotifications[currentStatus] || formatStatusText(currentStatus)}
            </p>
        </section>
    );
}
