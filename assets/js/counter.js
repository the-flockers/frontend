---
---

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // ease out
    const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentVal = Math.floor(easeOutProgress * (end - start) + start);
    obj.innerHTML = currentVal.toLocaleString();

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.innerHTML = end.toLocaleString();
    }
  };
  window.requestAnimationFrame(step);
}

document.addEventListener("DOMContentLoaded", () => {
  const countElement = document.getElementById('alpr-count');
  if (!countElement) return;

  fetch('{{ site.api_base_url[jekyll.environment] }}/alpr/count')
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then(textData => {
      const totalCameras = parseInt(textData.trim(), 10);

      if (!isNaN(totalCameras)) {
        animateValue(countElement, 0, totalCameras, 2000);
      } else {
        countElement.innerText = "many";
      }
    })
    .catch(error => {
      console.error("Error fetching camera count:", error);
      countElement.innerText = "many";
    });
});
