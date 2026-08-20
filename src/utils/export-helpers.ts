export const downloadSVG = (svgId: string, filename: string) => {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  // Add namespaces if missing
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadPNG = (svgId: string, filename: string, size: number = 1024) => {
  const svg = document.getElementById(svgId) as unknown as SVGSVGElement;
  if (!svg) return;

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const img = new Image();
  const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    const canvas = document.createElement('canvas');
    // Scale up for high-res PNG
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw background if needed (already handled by SVG style if properly serialized)
      ctx.drawImage(img, 0, 0, size, size);
      
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  };
  
  img.src = url;
};

export const copyToClipboard = async (svgId: string, size: number = 1024): Promise<boolean> => {
  try {
    const svg = document.getElementById(svgId) as unknown as SVGSVGElement;
    if (!svg) return false;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    const img = new Image();
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size);
          
          canvas.toBlob(async (blob) => {
            if (blob) {
              try {
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                resolve(true);
              } catch (err) {
                console.error('Clipboard copy failed:', err);
                resolve(false);
              }
            } else {
              resolve(false);
            }
          }, 'image/png');
        } else {
          resolve(false);
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};
