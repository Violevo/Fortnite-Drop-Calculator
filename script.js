document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('fortniteMapCanvas');
    const ctx = canvas.getContext('2d');

    const mapImage = new Image();
    mapImage.src = 'https://imagetolink.com/ib/f0126QUExl.png';

    let C = { x: 654.1326293496485, y: 379.4085654616584 };
    let circle1 = { x: 486, y: 859 };
    let circle2 = { x: 730, y: 163 };
    let dropmarker1 = { x: 285, y: 250 };
    let dropradius = { x: 285, y: 250 };
    let centerCircle = calculateMidpoint(circle1, circle2);
    const lineColor = 'black';
    const outlineColor = 'white';
    const outlineWidth = 1;
    let lineFlipped = false;

    var rX = 100;
    var rY = 100;
    var radius = 50;

    var circleColor = "blue";
    var lineWidth = 2;  
    drawradius(ctx, rX, rY, radius, circleColor, lineWidth);

    flipline();

    // m to px ratio
    // 100:110

    function initializeMap() {
        mapImage.onload = function () {
            ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
            drawLine(circle1, circle2);
            drawLine2(C, dropmarker1);
        };

        drawCircle('circle1', circle1);
        drawCircle('circle2', circle2);
        drawCircle('dropmarker', dropmarker1);
        drawCircle('centerCircle', centerCircle);
    }

    function getDrop() {
        C = findClosestPointOnLine(circle1, circle2, dropmarker1);
        drawLine2(C, dropmarker1, lineColor, outlineColor, outlineWidth);
    }

    function drawradius(context, centerX, centerY, radius, color, lineWidth) {
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.stroke();
        context.closePath();
    }

    initializeMap();

    canvas.addEventListener('click', function (event) {
        const clickX = event.clientX - canvas.getBoundingClientRect().left;
        const clickY = event.clientY - canvas.getBoundingClientRect().top;

        if (
            clickX >= getDropImageX &&
            clickX <= getDropImageX + getDropImage.width &&
            clickY >= getDropImageY &&
            clickY <= getDropImageY + getDropImage.height
        ) {
            getDrop();
        }
    });

    function initializeDraggable(id) {
        const circle = document.getElementById(id);

        circle.addEventListener('mousedown', function (event) {
            event.preventDefault();
            const onMouseMove = function (e) {
                const x = e.clientX;
                const y = e.clientY;

                circle.style.left = x - circle.clientWidth / 2 + 'px';
                circle.style.top = y - circle.clientHeight / 2 + 'px';

                updateCirclePositions(id, x, y);

                centerCircle = calculateMidpoint(circle1, circle2);
                drawLine(circle1, circle2);
                drawLine2(C, dropmarker1, lineColor, outlineColor, outlineWidth);
            };

            const onMouseUp = function () {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function updateCirclePositions(id, x, y) {
        if (id === 'circle1') {
            circle1 = { x, y };
        } else if (id === 'circle2') {
            circle2 = { x, y };
        } else if (id === 'centerCircle') {
            centerCircle = { x, y };
        }
    }

    initializeDraggable('circle1');
    initializeDraggable('circle2');
    initializeDraggable('dropmarker');
    initializeDraggable('centerCircle');
    initializeDraggable('dropradius');

    findClosestPointOnLine(circle1, circle2, dropmarker1);
    drawLine2(C, dropmarker1, lineColor, outlineColor, outlineWidth);
    drawLine(circle1, circle2);
    const getDropCanvas = document.getElementById('fortniteMapCanvas');
    const getDropCtx = getDropCanvas.getContext('2d');

    const getDropImage = new Image();
    getDropImage.src = "";

    const getDropImageX = 400;
    const getDropImageY = 1;

    getDropCanvas.addEventListener('click', function (event) {
        const clickX = event.clientX - getDropCanvas.getBoundingClientRect().left;
        const clickY = event.clientY - getDropCanvas.getBoundingClientRect().top;

        if (
            clickX >= getDropImageX &&
            clickX <= getDropImageX + getDropImage.width &&
            clickY >= getDropImageY &&
            clickY <= getDropImageY + getDropImage.height
        ) {
            getDrop();
        }
    });

    function findClosestPointOnLine(A, B, P) {
        const AB = { x: B.x - A.x, y: B.y - A.y };
        const AP = { x: P.x - A.x, y: P.y - A.y };
        const scalarProjection = (AP.x * AB.x + AP.y * AB.y) / (Math.pow(AB.x, 2) + Math.pow(AB.y, 2));
        const C = {
            x: A.x + scalarProjection * AB.x,
            y: A.y + scalarProjection * AB.y
        };

        return C;
    }

    function distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function canvas_arrow(context, fromx, fromy, tox, toy, r, color, outlineColor, outlineWidth) {
        var x_center = tox;
        var y_center = toy;
        var angle = Math.atan2(toy - fromy, tox - fromx);
        var x = r * Math.cos(angle) + x_center;
        var y = r * Math.sin(angle) + y_center;
        context.beginPath();
        context.moveTo(x, y);
        angle += (1 / 3) * (2 * Math.PI);
        x = r * Math.cos(angle) + x_center;
        y = r * Math.sin(angle) + y_center;
        context.lineTo(x, y);
        angle += (1 / 3) * (2 * Math.PI);
        x = r * Math.cos(angle) + x_center;
        y = r * Math.sin(angle) + y_center;
        context.lineTo(x, y);
        context.closePath();
        context.fillStyle = "black";
        context.fill();
        context.strokeStyle = outlineColor;
        context.lineWidth = outlineWidth;
        context.stroke();
    }

    function flipline() {
        [circle1, circle2] = [circle2, circle1];
        drawCircle('circle1', circle1);
        drawCircle('circle2', circle2);
        drawLine(circle1, circle2, lineColor, outlineColor, outlineWidth);
        drawLine2(C, dropmarker1, lineColor, outlineColor, outlineWidth);
        lineFlipped = !lineFlipped;
    }

    const flipLineButton = document.getElementById('centerCircle');
    flipLineButton.addEventListener('click', flipline);

    function drawLine(start, end, lineColor, outlineColor, outlineWidth) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

        C = findClosestPointOnLine(circle1, circle2, dropmarker1);
        drawLine2(C, dropmarker1, lineColor, outlineColor, outlineWidth);

        // Calculate the midpoint of the line
        const midPoint = calculateMidpoint(start, end);

        // Update the position of the center circle
        centerCircle = midPoint;
        drawCircle('centerCircle', centerCircle);

        // Update the dropradius
        drawCircle('dropradius', dropradius);

        // Find the direction and length of the line
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        // Extend line factor:
        const extendFactor = 100;

        // Calculate the extended Start points
        const extendedStart = {
            x: start.x - dx * extendFactor,
            y: start.y - dy * extendFactor
        };

        // Calculate the extended End points
        const extendedEnd = {
            x: end.x + dx * extendFactor,
            y: end.y + dy * extendFactor
        };

        // Draw line
        ctx.beginPath();

        if (!lineFlipped) {
            ctx.moveTo(extendedStart.x, extendedStart.y);
            ctx.lineTo(extendedEnd.x, extendedEnd.y);
        } else {
            ctx.moveTo(extendedEnd.x, extendedEnd.y);
            ctx.lineTo(extendedStart.x, extendedStart.y);
        }

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw outline
        ctx.beginPath();

        if (!lineFlipped) {
            ctx.moveTo(extendedStart.x, extendedStart.y);
            ctx.lineTo(extendedEnd.x, extendedEnd.y);
        } else {
            ctx.moveTo(extendedEnd.x, extendedEnd.y);
            ctx.lineTo(extendedStart.x, extendedStart.y);
        }

        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.stroke();

        // Calculate and draw multiple arrowheads along the line
        const numArrowheads = 10000;
        for (let i = 1; i <= numArrowheads; i++) {
            const ratio = i / (numArrowheads + 1);
            const arrow = calculateArrowheadPosition(extendedStart.x, extendedStart.y, extendedEnd.x, extendedEnd.y, 10, ratio);
            canvas_arrow(ctx, arrow.fromx, arrow.fromy, arrow.tox, arrow.toy, 5);
        }
        
    }

    function drawLine2(start, end, lineColor, outlineColor, outlineWidth) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
    
        // Draw the line
        ctx.beginPath();
        if (!lineFlipped) {
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
        } else {
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(start.x, start.y);
        }
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    
        // Draw the radius around the dropmarker
        ctx.beginPath();
        ctx.arc(dropmarker1.x, dropmarker1.y, 110, 0, 2 * Math.PI);
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.stroke();
    
        // Draw arrowheads
        const numArrowheads = 25;
        for (let i = 1; i <= numArrowheads; i++) {
            const ratio = i / (numArrowheads + 1);
            const arrow = calculateArrowheadPosition(start.x, start.y, end.x, end.y, 10, ratio);
            canvas_arrow(ctx, arrow.fromx, arrow.fromy, arrow.tox, arrow.toy, 5);
        }
    }
    

    function calculateArrowheadPosition(fromx, fromy, tox, toy, r, ratio) {
        const x_center = fromx + (tox - fromx) * ratio;
        const y_center = fromy + (toy - fromy) * ratio;
        const angle = Math.atan2(toy - fromy, tox - fromx);
        const x = r * Math.cos(angle) + x_center;
        const y = r * Math.sin(angle) + y_center;
        return { fromx: x_center, fromy: y_center, tox: x, toy: y };
    }

    function drawCircle(id, position) {
        const circle = document.getElementById(id);
        circle.style.left = position.x - circle.clientWidth / 2 + 'px';
        circle.style.top = position.y - circle.clientHeight / 2 + 'px';
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
        drawLine(circle1, circle2);
    }

    function calculateMidpoint(point1, point2) {
        return {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2
        };
    }
});
