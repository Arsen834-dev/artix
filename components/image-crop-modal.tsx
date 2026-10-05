'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';
type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ImageCropModalProps = {
  image: string;
  aspect: number;
  shape?: 'rect' | 'round';
  onCancel: () => void;
  onComplete: (croppedBlob: Blob) => void;
  title?: string;
};

// 🎯 Функция обрезки через Canvas API
async function getCroppedImg(
  imageSrc: string,
  crop: CropArea,
  targetSize: number
): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  // Определяем размеры
  const isLandscape = crop.width > crop.height;
  const outputWidth = isLandscape ? targetSize : targetSize * (crop.width / crop.height);
  const outputHeight = isLandscape ? targetSize * (crop.height / crop.width) : targetSize;

  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No canvas context');

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      'image/jpeg',
      0.95
    );
  });
}

export function ImageCropModal({
  image,
  aspect,
  shape = 'rect',
  onCancel,
  onComplete,
  title = 'Обрежь картинку',
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  useBodyScrollLock(true);
  const onCropComplete = useCallback(
    (_croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      // Для аватарки 400px, для обложки 1600px
      const targetSize = shape === 'round' ? 400 : 1600;
      const blob = await getCroppedImg(image, croppedAreaPixels, targetSize);
      onComplete(blob);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        {/* Затемнение */}
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          onClick={onCancel}
        />

        {/* Модалка */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#16161f]"
        >
          {/* Заголовок */}
          <div className="flex items-center justify-between border-b border-white/5 p-5">
            <h2 className="display-title text-xl font-bold text-white">
              {title}
            </h2>
            <button
              onClick={onCancel}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Кроп-зона */}
          <div className="relative h-[400px] w-full bg-black">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={shape === 'round' ? 'round' : 'rect'}
              showGrid={shape !== 'round'}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: {
                  background: '#000',
                },
                cropAreaStyle: {
                  border: '2px solid rgba(183, 148, 246, 0.8)',
                  boxShadow: '0 0 0 9999em rgba(0, 0, 0, 0.8)',
                },
              }}
            />
          </div>

          {/* Управление */}
          <div className="space-y-4 p-5">
            {/* Зум */}
            <div className="flex items-center gap-4">
              <ZoomOut className="h-4 w-4 shrink-0 text-white/40" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#6C63FF]"
                style={{
                  background: `linear-gradient(to right, #6C63FF 0%, #6C63FF ${
                    ((zoom - 1) / 2) * 100
                  }%, rgba(255,255,255,0.1) ${
                    ((zoom - 1) / 2) * 100
                  }%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              <ZoomIn className="h-4 w-4 shrink-0 text-white/40" />
            </div>

            {/* Подсказка */}
            <p className="text-center text-xs text-white/40">
              Перетаскивай картинку, чтобы выбрать область. Используй ползунок
              для зума.
            </p>

            {/* Кнопки */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isProcessing}
                className="group relative flex-1 overflow-hidden rounded-full border border-white/10 bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-500 disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500 group-hover:text-white">
                  {isProcessing ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Обработка...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Применить
                    </>
                  )}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}