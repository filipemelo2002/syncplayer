const container = document.querySelector(".label");
const label = document.querySelector(".label");
container.addEventListener("mousemove", () => {
  label.style.setProperty("opacity", 1);
  label.addEventListener("transitionend", fadeOut, { once: true });
});

const fadeOut = ({ target }) => {
  setTimeout(() => {
    target.style.setProperty("opacity", 0);
  }, 3000);
};
