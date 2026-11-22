const rail = document.querySelector(".project-rail");
const progress = document.querySelector(".rail-progress span");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let drag;
let suppressLink = false;
const updateProgress = () => {
  const range = rail.scrollWidth - rail.clientWidth;
  const width = Math.min(1, rail.clientWidth / rail.scrollWidth);
  const position = range > 0 ? rail.scrollLeft / range : 0;
  progress.style.width = width * 100 + "%";
  progress.style.left = position * (1 - width) * 100 + "%";
};
rail.addEventListener("scroll", updateProgress, {passive:true});
new ResizeObserver(updateProgress).observe(rail);
updateProgress();
rail.addEventListener("keydown", event => {
  if (event.target !== rail || !["ArrowLeft","ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  const distance = rail.firstElementChild.getBoundingClientRect().width + 15;
  rail.scrollBy({left: distance * (event.key === "ArrowRight" ? 1 : -1), behavior: reduced.matches ? "instant" : "smooth"});
});
rail.addEventListener("dragstart", event => event.preventDefault());
rail.addEventListener("pointerdown", event => {
  if (event.pointerType !== "mouse" || event.button !== 0) return;
  suppressLink = false;
  drag = {id:event.pointerId, x:event.clientX, scroll:rail.scrollLeft, active:false};
});
rail.addEventListener("pointermove", event => {
  if (!drag || event.pointerId !== drag.id) return;
  const delta = event.clientX - drag.x;
  if (!drag.active && Math.abs(delta) < 7) return;
  if (!drag.active) {
    drag.active = true;
    suppressLink = true;
    rail.setPointerCapture(event.pointerId);
    rail.classList.add("is-dragging");
  }
  rail.scrollLeft = drag.scroll - delta;
});
function finish(event) {
  if (!drag || (event.type === "pointercancel" && event.pointerId !== drag.id)) return;
  rail.classList.remove("is-dragging");
  drag = undefined;
  setTimeout(() => { suppressLink = false; }, 0);
}
window.addEventListener("pointerup", finish);
rail.addEventListener("pointercancel", finish);
rail.addEventListener("click", event => {
  if (suppressLink) { event.preventDefault(); event.stopPropagation(); }
}, true);

