import Image from "next/image";

export function ReviewSidebar() {
    return (
        <div className="w-[240px] flex-shrink-0">
            <div className="rounded-2xl bg-[#1E8F59] text-white relative overflow-hidden h-[420px]">
                {/* Character Image - positioned at bottom left */}
                <div className="absolute bottom-0 -left-4 pointer-events-none">
                    <Image
                        src="/img/karakter.png"
                        alt="Character"
                        width={160}
                        height={220}
                        className="object-contain"
                        unoptimized
                    />
                </div>

                {/* Union decoration - top left corner */}
                <div className="absolute top-4 left-4 z-30 pointer-events-none">
                    <Image
                        src="/img/Union.png"
                        alt="Decoration"
                        width={32}
                        height={32}
                        className="opacity-100"
                        unoptimized
                    />
                </div>

                {/* PasJajan Logo - top right */}
                <div className="absolute top-4 right-4 z-30 pointer-events-none">
                    <Image
                        src="/logo-footer.png"
                        alt="PasJajan"
                        width={36}
                        height={36}
                        unoptimized
                    />
                </div>

                {/* Text Content - positioned in upper-middle area */}
                <div className="absolute top-[70px] left-4 right-4 z-20 pointer-events-none">
                    <p className="text-[13px] font-bold leading-snug drop-shadow-sm">
                        Kami harap kamu menyukainya! Ceritakan pengalamanmu agar kami bisa melayanimu lebih baik lagi.
                    </p>
                </div>
            </div>
        </div>
    );
}
