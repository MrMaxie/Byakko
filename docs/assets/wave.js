window.addEventListener('DOMContentLoaded', () => {
    const c = document.querySelector('#wave');
    const ctx = c.getContext('2d');

    const resize = () => {
        c.height = c.parentElement.clientHeight;
        c.width = c.parentElement.clientWidth;
        ctx.width = c.width;
        ctx.height = c.height;
    }

    let last = Date.now();
    let iter = 0;
    const possibleSteps = [1, 3, 10, 15, 30, 60]
    const steps = possibleSteps[Math.floor(Math.random() * possibleSteps.length)];;

    const redraw = () => {

        ctx.clearRect(0, 0, ctx.width, ctx.height);

        // const steps = 360; //Math.ceil(ctx.width / 500);
        const nd = Date.now();
        iter += ((nd - last) / 50000);
        last = nd;

        if (iter >= 2) {
            iter = iter % 2;
        }

        const grad1 = ctx.createLinearGradient(ctx.width * -0.25, ctx.height * -0.25, ctx.width, ctx.height);
        grad1.addColorStop(0, '#f09ae9');
        grad1.addColorStop(1, '#ffc1fa');

        const grad2 = ctx.createLinearGradient(ctx.width * -0.25, ctx.height * -0.25, ctx.width, ctx.height);
        grad2.addColorStop(0, '#ffe0f7');
        grad2.addColorStop(1, '#fe91ca');

        const sin = (d, b = true) => {

            ctx.strokeStyle = b ? grad1 : grad2;

            let prevX = -ctx.width;
            let prevY = ctx.height / 2;
            ctx.beginPath();
            for(let x = 0; x <= steps; x += 1){
                ctx.moveTo(prevX, prevY);
                const y = Math.sin(((x / steps) + d) * 2 * Math.PI);
                prevX = (x / steps) * (ctx.width * 1.1);
                prevY = ((((y + 1) / 2) * 0.8) + 0.1) * ctx.height;
                ctx.lineTo(prevX, prevY);
            }
            ctx.stroke();
        }

        ctx.filter = 'none';
        ctx.lineWidth = 0.5;
        for (let t = 0; t <= 10; t++) {
            sin(iter + t * .1, t % 2 === 1);
        }

        ctx.lineWidth = 1;
        let isOdd = true;
        for (let t = 0; t <= 50; t += 3) {
            isOdd = !isOdd;
            sin(iter + t * .005, isOdd);
        }

        requestAnimationFrame(redraw);
    }

    const init = () => {
        resize();
        requestAnimationFrame(redraw);
    }

    init();
    window.addEventListener('resize', resize);
});