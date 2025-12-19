export const drawLandmarks = (ctx, landmarks) => {
    if (!landmarks) return;
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#d8b4fe';
    ctx.shadowBlur = 10;

    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    const connections = [
        ['shoulder', 'elbow'],
        ['elbow', 'wrist']
    ];

    ctx.strokeStyle = '#fcf40a';
    ctx.lineWidth = 4;

    connections.forEach(([start, end]) => {
        const p1 = landmarks[start];
        const p2 = landmarks[end];

        // Convert normalized coordinates (0-1) to canvas pixel size
        // Note: MediaPipe returns x,y as 0.0 to 1.0
        const x1 = p1[0] * ctx.canvas.width;
        const y1 = p1[1] * ctx.canvas.height;
        const x2 = p2[0] * ctx.canvas.width;
        const y2 = p2[1] * ctx.canvas.height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    });

    // draw Points (Joints)
    Object.values(landmarks).forEach(point => {
        const x = point[0] * ctx.canvas.width;
        const y = point[1] * ctx.canvas.height;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
    });
};