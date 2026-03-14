import { Copy, Download, UploadIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const TWIBBON_OVERLAY_PATH = '/registrations/Twibbon Siap Impact.png';
const DEFAULT_CAPTION = `I’m ready to be part of the Impact Makers! 🌟
Saya (Nama) dari (Nama Kampus) siap bergabung dalam SIAP Impact 2026 bersama Kementerian Kependudukan dan Pembangunan Keluarga Republik Indonesia.
Dengan semangat From Youth to Indonesia’s Future, saya siap berkontribusi, berkolaborasi, dan menciptakan dampak positif bagi masyarakat serta masa depan Indonesia. 🇮🇩
#SIAPImpact2026 #SIAPImpact #ImpactMakers2026 #FromYouthToIndonesiasFuture #GenZBerdaya #AnakMudaBerdampak`;

type TransformState = {
    offsetX: number;
    offsetY: number;
    scale: number;
};

type ImageMetrics = {
    width: number;
    height: number;
};

type TwibbonEditorModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCopyCaption: (caption: string) => Promise<void> | void;
};

const OVERLAY_WIDTH = 1264;
const OVERLAY_HEIGHT = 1579;
const PREVIEW_WIDTH = 320;
const PREVIEW_HEIGHT = Math.round(
    PREVIEW_WIDTH * (OVERLAY_HEIGHT / OVERLAY_WIDTH),
);
const FRAME_BOUNDS = {
    x: 216 / OVERLAY_WIDTH,
    y: 309 / OVERLAY_HEIGHT,
    width: 908 / OVERLAY_WIDTH,
    height: 908 / OVERLAY_HEIGHT,
};
const DEFAULT_TRANSFORM: TransformState = {
    offsetX: 0,
    offsetY: 0,
    scale: 1,
};

type CompositionSize = {
    width: number;
    height: number;
};

function createRoundedRectPath(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
) {
    const safeRadius = Math.min(radius, width / 2, height / 2);

    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.lineTo(x + width - safeRadius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    context.lineTo(x + width, y + height - safeRadius);
    context.quadraticCurveTo(
        x + width,
        y + height,
        x + width - safeRadius,
        y + height,
    );
    context.lineTo(x + safeRadius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    context.lineTo(x, y + safeRadius);
    context.quadraticCurveTo(x, y, x + safeRadius, y);
    context.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        image.src = src;
    });
}

function getCoverDimensions(
    imageWidth: number,
    imageHeight: number,
    frameWidth: number,
    frameHeight: number,
    scale: number,
) {
    const coverRatio = Math.max(
        frameWidth / imageWidth,
        frameHeight / imageHeight,
    );

    return {
        width: imageWidth * coverRatio * scale,
        height: imageHeight * coverRatio * scale,
    };
}

function getFrameRect(size: CompositionSize) {
    return {
        x: size.width * FRAME_BOUNDS.x,
        y: size.height * FRAME_BOUNDS.y,
        width: size.width * FRAME_BOUNDS.width,
        height: size.height * FRAME_BOUNDS.height,
    };
}

async function normalizeImageFile(file: File) {
    const bitmap = await createImageBitmap(file, {
        imageOrientation: 'from-image',
    });

    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext('2d');

    if (!context) {
        bitmap.close();
        throw new Error('Canvas context not available');
    }

    context.drawImage(bitmap, 0, 0);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
    });

    if (!blob) {
        throw new Error('Failed to normalize image');
    }

    return {
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
    };
}

function drawComposition({
    context,
    size,
    photo,
    overlay,
    transform,
}: {
    context: CanvasRenderingContext2D;
    size: CompositionSize;
    photo: HTMLImageElement | null;
    overlay: HTMLImageElement;
    transform: TransformState;
}) {
    context.clearRect(0, 0, size.width, size.height);

    if (photo) {
        const frame = getFrameRect(size);
        const frameRadius = frame.width * 0.08;
        const dimensions = getCoverDimensions(
            photo.naturalWidth,
            photo.naturalHeight,
            frame.width,
            frame.height,
            transform.scale,
        );

        const drawX =
            frame.x +
            (frame.width - dimensions.width) / 2 +
            transform.offsetX * frame.width;
        const drawY =
            frame.y +
            (frame.height - dimensions.height) / 2 +
            transform.offsetY * frame.height;

        context.save();
        createRoundedRectPath(
            context,
            frame.x,
            frame.y,
            frame.width,
            frame.height,
            frameRadius,
        );
        context.clip();
        context.drawImage(
            photo,
            drawX,
            drawY,
            dimensions.width,
            dimensions.height,
        );
        context.restore();
    }

    context.drawImage(overlay, 0, 0, size.width, size.height);
}

export function TwibbonEditorModal({
    open,
    onOpenChange,
    onCopyCaption,
}: TwibbonEditorModalProps) {
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [sourceUrl, setSourceUrl] = useState<string | null>(null);
    const [sourceMetrics, setSourceMetrics] = useState<ImageMetrics | null>(
        null,
    );
    const [isOverlayReady, setIsOverlayReady] = useState(false);
    const [transform, setTransform] =
        useState<TransformState>(DEFAULT_TRANSFORM);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const sourceImageRef = useRef<HTMLImageElement | null>(null);
    const overlayImageRef = useRef<HTMLImageElement | null>(null);

    const dragStateRef = useRef<{
        pointerId: number;
        startX: number;
        startY: number;
        initialOffsetX: number;
        initialOffsetY: number;
    } | null>(null);

    useEffect(() => {
        let cancelled = false;

        loadImage(TWIBBON_OVERLAY_PATH)
            .then((image) => {
                if (!cancelled) {
                    overlayImageRef.current = image;
                    setIsOverlayReady(true);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError('Template twibbon tidak bisa dimuat. Coba lagi.');
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!open) {
            setSourceFile(null);
            setSourceMetrics(null);
            setTransform(DEFAULT_TRANSFORM);
            setError(null);
            setDragging(false);
            sourceImageRef.current = null;

            if (sourceUrl) {
                URL.revokeObjectURL(sourceUrl);
                setSourceUrl(null);
            }
        }
    }, [open, sourceUrl]);

    useEffect(() => {
        const canvas = previewCanvasRef.current;
        const overlay = overlayImageRef.current;

        if (!open || !canvas || !overlay || !isOverlayReady) {
            return;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        canvas.width = PREVIEW_WIDTH;
        canvas.height = PREVIEW_HEIGHT;

        drawComposition({
            context,
            size: {
                width: PREVIEW_WIDTH,
                height: PREVIEW_HEIGHT,
            },
            photo: sourceImageRef.current,
            overlay,
            transform,
        });
    }, [isOverlayReady, open, sourceMetrics, transform]);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0] ?? null;

        if (!file) {
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setError('Foto harus berformat JPG atau PNG.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Ukuran foto maksimal 5MB.');
            return;
        }

        try {
            const normalizedFile = await normalizeImageFile(file);
            const image = await loadImage(normalizedFile.url);

            if (sourceUrl) {
                URL.revokeObjectURL(sourceUrl);
            }

            sourceImageRef.current = image;
            setSourceFile(file);
            setSourceUrl(normalizedFile.url);
            setSourceMetrics({
                width: normalizedFile.width,
                height: normalizedFile.height,
            });
            setTransform(DEFAULT_TRANSFORM);
            setError(null);
        } catch {
            setError('Foto tidak bisa dimuat. Silakan pilih file lain.');
            sourceImageRef.current = null;
            setSourceFile(null);
            setSourceUrl(null);
            setSourceMetrics(null);
        } finally {
            event.target.value = '';
        }
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!sourceMetrics) {
            return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);
        dragStateRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            initialOffsetX: transform.offsetX,
            initialOffsetY: transform.offsetY,
        };
        setDragging(true);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (
            !dragStateRef.current ||
            dragStateRef.current.pointerId !== event.pointerId
        ) {
            return;
        }

        const frame = getFrameRect({
            width: PREVIEW_WIDTH,
            height: PREVIEW_HEIGHT,
        });
        const deltaX =
            (event.clientX - dragStateRef.current.startX) / frame.width;
        const deltaY =
            (event.clientY - dragStateRef.current.startY) / frame.height;

        setTransform((current) => ({
            offsetX: dragStateRef.current!.initialOffsetX + deltaX,
            offsetY: dragStateRef.current!.initialOffsetY + deltaY,
            scale: current.scale,
        }));
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (dragStateRef.current?.pointerId === event.pointerId) {
            event.currentTarget.releasePointerCapture(event.pointerId);
            dragStateRef.current = null;
            setDragging(false);
        }
    };

    const handleDownload = async () => {
        const photoImage = sourceImageRef.current;
        const overlayImage = overlayImageRef.current;

        if (!photoImage || !sourceMetrics || !overlayImage) {
            setError('Unggah foto terlebih dahulu sebelum mengunduh twibbon.');
            return;
        }

        setIsDownloading(true);
        setError(null);

        try {
            const canvas = document.createElement('canvas');
            canvas.width = OVERLAY_WIDTH;
            canvas.height = OVERLAY_HEIGHT;

            const context = canvas.getContext('2d');

            if (!context) {
                throw new Error('Canvas context not available');
            }

            drawComposition({
                context,
                size: {
                    width: OVERLAY_WIDTH,
                    height: OVERLAY_HEIGHT,
                },
                photo: photoImage,
                overlay: overlayImage,
                transform,
            });

            const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, 'image/png');
            });

            if (!blob) {
                throw new Error('Failed to generate twibbon file');
            }

            const downloadUrl = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = downloadUrl;
            anchor.download = 'twibbon-siap-impact.png';
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(downloadUrl);
        } catch {
            setError('Twibbon gagal dibuat. Coba unggah ulang fotonya.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Editor Twibbon</DialogTitle>
                    <DialogDescription className="sr-only">
                        Upload foto, atur posisi dan ukuran di dalam template,
                        lalu download twibbon atau salin caption.
                    </DialogDescription>
                </DialogHeader>

                <Input
                    ref={fileInputRef}
                    id="twibbon_source_photo"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="space-y-4">
                    <div
                        className={cn(
                            'relative mx-auto overflow-hidden rounded-2xl border bg-muted/40 shadow-sm',
                            sourceFile
                                ? 'cursor-grab touch-none'
                                : 'cursor-default',
                            dragging && 'cursor-grabbing',
                        )}
                        style={{
                            width: `${PREVIEW_WIDTH}px`,
                            height: `${PREVIEW_HEIGHT}px`,
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                    >
                        {!sourceFile && (
                            <img
                                src={TWIBBON_OVERLAY_PATH}
                                alt="Template twibbon SIAP Impact"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        )}

                        <canvas
                            ref={previewCanvasRef}
                            aria-label="Preview twibbon SIAP Impact"
                            className={cn(
                                'absolute inset-0 h-full w-full',
                                !sourceFile && 'opacity-0',
                            )}
                        />

                        {!sourceFile && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <UploadIcon className="h-4 w-4" />
                                    Upload Foto
                                </Button>
                            </div>
                        )}
                    </div>

                    {sourceFile && (
                        <div className="space-y-2">
                            <input
                                id="twibbon_scale"
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.01"
                                value={transform.scale}
                                onChange={(event) =>
                                    setTransform((current) => ({
                                        ...current,
                                        scale: Number(event.target.value),
                                    }))
                                }
                                className="w-full accent-primary"
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-sm font-medium text-destructive">
                            {error}
                        </p>
                    )}

                    <div className="rounded-xl border bg-muted/30 p-3">
                        <p className="mb-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                            Preview Caption
                        </p>
                        <div className="max-h-40 overflow-y-auto text-sm leading-6 whitespace-pre-wrap text-foreground/90">
                            {DEFAULT_CAPTION}
                        </div>
                    </div>
                </div>

                <DialogFooter className="items-end justify-end sm:items-center">
                    <Button
                        type="button"
                        onClick={handleDownload}
                        disabled={!sourceFile || isDownloading}
                    >
                        <Download className="h-4 w-4" />
                        {isDownloading ? 'Menyiapkan File...' : 'Download'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onCopyCaption(DEFAULT_CAPTION)}
                    >
                        <Copy className="h-4 w-4" />
                        Salin Caption
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
