import React, { useState, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ImageCropper({ image, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imgRef, setImgRef] = useState(null);

  const onLoad = useCallback((img) => {
    setImgRef(img);
  }, []);

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.naturalWidth / imgRef.width;
    const scaleY = imgRef.naturalHeight / imgRef.height;

    // Definir tamanho máximo como 1080x1080
    const maxSize = 1080;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Calcular o tamanho final mantendo o aspect ratio
    let finalWidth = cropWidth;
    let finalHeight = cropHeight;

    if (cropWidth > maxSize || cropHeight > maxSize) {
      if (cropWidth >= cropHeight) {
        finalWidth = maxSize;
        finalHeight = (cropHeight / cropWidth) * maxSize;
      } else {
        finalHeight = maxSize;
        finalWidth = (cropWidth / cropHeight) * maxSize;
      }
    }

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      imgRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      finalWidth,
      finalHeight
    );

    // Converter para Blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  }, [completedCrop, imgRef]);

  const handleComplete = async () => {
    const croppedBlob = await getCroppedImg();
    if (croppedBlob) {
      // Criar um arquivo a partir do blob
      const croppedFile = new File([croppedBlob], 'cropped-avatar.jpg', {
        type: 'image/jpeg'
      });
      onCropComplete(croppedFile);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-green-500">Ajuste sua foto</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[500px] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              src={image}
              onLoad={(e) => onLoad(e.currentTarget)}
              alt="Crop me"
              className="max-w-full"
            />
          </ReactCrop>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={handleComplete}>Concluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
