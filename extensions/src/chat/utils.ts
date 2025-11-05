export const getImageHelper = (width, height) => {
    const canvas = document.body.appendChild(document.createElement("canvas"));
    canvas.hidden = true;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
  
    return {
      /**
       * 
       * @param mask 
       * @param color 
       * @returns 
       */
      colorIn(mask: ImageBitmap, color: string) {
        context.save();
        context.clearRect(0, 0, width, height);
        context.drawImage(mask, 0, 0);
        context.globalCompositeOperation = 'source-in';
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
        return context.getImageData(0, 0, width, height);
      },
      /**
       * 
       * @param image 
       * @param mask 
       * @returns 
       */
      getMasked(image: ImageBitmap, mask: ImageBitmap) {
        context.save();
        context.clearRect(0, 0, width, height);
        context.drawImage(mask, 0, 0);
        context.globalCompositeOperation = 'source-in';
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        context.restore();
        return context.getImageData(0, 0, width, height);
      },
      /**
       * 
       * @param image 
       * @returns 
       */
      getDataURL(image: ImageData) {
        context.save();
        context.clearRect(0, 0, width, height);
        context.putImageData(image, 0, 0);
        const url = canvas.toDataURL('image/png');
        context.restore();
        return url;
      },

      async drawBase64(base64: string) {
        return new Promise<ImageData>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            context.save();
            context.clearRect(0, 0, width, height);
            context.drawImage(img, 0, 0, width, height);
            context.restore();
            resolve(context.getImageData(0, 0, width, height));
          };
          img.onerror = reject;
          img.src = base64.startsWith("data:")
            ? base64
            : `data:image/png;base64,${base64}`;
        });
      },
    }
  }