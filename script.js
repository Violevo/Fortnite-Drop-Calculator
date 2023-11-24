document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('fortniteMapCanvas');
  const ctx = canvas.getContext('2d');

  // draw map 
  const mapImage = new Image();
  mapImage.src = 'https://imagetolink.com/ib/f0126QUExl.png';

  mapImage.onload = function() {
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
  };

  // Initial circle positions
  let circle1 = { x: 100, y: 100 };
  let circle2 = { x: 300, y: 300 };

  // Draw circles 
  drawCircle('circle1', circle1);
  drawCircle('circle2', circle2);

  // Make draggable
  makeDraggable('circle1');
  makeDraggable('circle2');

  // Draw line between circles
  drawLine(circle1, circle2);

  function drawCircle(id, position) {
    const circle = document.getElementById(id);
    circle.style.left = position.x - circle.clientWidth / 2 + 'px';
    circle.style.top = position.y - circle.clientHeight / 2 + 'px';
  }

  function makeDraggable(id) {
    const circle = document.getElementById(id);

    circle.addEventListener('mousedown', function(event) {
      event.preventDefault();

      const onMouseMove = function(e) {
        const x = e.clientX;
        const y = e.clientY;

        circle.style.left = x - circle.clientWidth / 2 + 'px';
        circle.style.top = y - circle.clientHeight / 2 + 'px';

        if (id === 'circle1') {
          circle1 = { x: x, y: y };
        } else if (id === 'circle2') {
          circle2 = { x: x, y: y };
        }

        drawLine(circle1, circle2);
      };

      const onMouseUp = function() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  function drawLine(start, end) {
    
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

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
    ctx.moveTo(extendedStart.x, extendedStart.y);
    ctx.lineTo(extendedEnd.x, extendedEnd.y);
    ctx.strokeStyle = 'white'; // White line
    ctx.lineWidth = 2;
    ctx.stroke();
  }


});