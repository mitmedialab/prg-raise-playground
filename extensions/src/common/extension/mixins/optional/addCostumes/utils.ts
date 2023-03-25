export const getUrlHelper = (dimensions: { width: number, height: number }) => {
  const canvas = document.body.appendChild(document.createElement("canvas"));

  const setDimensions = ({ width, height }: Parameters<typeof getUrlHelper>[0]) => {
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
  };

  setDimensions(dimensions);

  canvas.hidden = true;
  const context = canvas.getContext("2d");

  return {
    /**
     * 
     * @param image 
     * @returns 
     */
    getDataURL(image: ImageData) {
      const { width, height } = image;
      setDimensions(image);
      context.save();
      context.clearRect(0, 0, width, height);
      context.putImageData(image, 0, 0);
      const url = canvas.toDataURL('image/png');
      context.restore();
      return url;
    }
  }
}