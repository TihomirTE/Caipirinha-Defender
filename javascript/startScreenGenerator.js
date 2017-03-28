let background = createBackground({
    width: 1024,
    height: 600,
    speed: 1
});

function backGroundLoop() {
    background.render();
    background.update();
    window.requestAnimationFrame(backGroundLoop);
}
backGroundLoop();