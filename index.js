const PHRASE = "love you";
const CIRCLES_COUNT = 50;
const filteredLetters = PHRASE.toUpperCase().split("").filter(l => l !== " ");
const elCounts = CIRCLES_COUNT + filteredLetters.length;

function createElement(e, i, letter = "", wrapper) {
  const elWrapper = document.createElement("div");
  if (i < filteredLetters.length) {
    elWrapper.className = "letter-wrapper";
    elWrapper.style.left = e.clientX - 20 + "px";
    elWrapper.style.top = e.clientY - 20 + "px";
    elWrapper.innerText = letter;
  } else {
    const diag = Math.sqrt(wrapper.clientWidth ** 2 + wrapper.clientHeight ** 2);
    const size = Math.random() * diag / 50 + 5;
    const bgColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    elWrapper.style.left = e.clientX - size / 2 + "px";
    elWrapper.style.top = e.clientY - size / 2 + "px";
    elWrapper.style.width = size + "px";
    elWrapper.style.height = size + "px";
    elWrapper.style.backgroundColor = bgColor;
    elWrapper.className = "resize";
  }
  return elWrapper;
}

function animate({ timing, draw, duration }) {
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    let progress = timing(timeFraction);
    draw(progress);
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

function addElementsLimits(el, wrapperSize) {
  el.style.top = el.getBoundingClientRect().top <= 0 && '0px';
  el.style.left = el.getBoundingClientRect().left <= 0 && '0px';
  el.style.left = el.getBoundingClientRect().right >= wrapperSize.width && wrapperSize.width - el.getBoundingClientRect().width + "px";
  el.style.top = el.getBoundingClientRect().bottom >= wrapperSize.height && wrapperSize.height - el.getBoundingClientRect().height + "px";
}

function createFireworkInQuarter(quarter, el, wrapperSize, timing, speed, angle, x, y, duration) {
  animate({
    timing(timeFraction) {
      return timeFraction * timing;
    },
    draw(progress) {
      el.style.left = quarter === 0 || quarter === 1 ? x + progress * angle * 2 + 'px' : el.style.left = x - progress * angle * 2 + 'px';
      el.style.top = quarter === 0 || quarter === 3 ? y + Math.pow((progress * speed - speed), 2) - Math.pow(speed, 2) + 'px' : y + Math.pow((progress * speed), 2) + 'px';
      addElementsLimits(el, wrapperSize);
    },
    duration: duration
  })
}

function createFirework(e) {
  const wrapper = document.querySelector(".wrapper");
  const wrapperSize = wrapper.getBoundingClientRect();
  for (let i = 0; i < elCounts; i++) {
    const randomQuarter = Math.floor(Math.random() * 4);
    const element = createElement(e, i, filteredLetters[i], wrapper);
    wrapper.append(element);
    setTimeout(() => element.remove(), 1400);
    const x = parseFloat(element.style.left);
    const y = parseFloat(element.style.top);
    const angle = Math.random() * 120;
    const speed = Math.random() * 20;
    const timing = Math.random() + 0.5;
    const duration = i < filteredLetters.length ? 1400 : 1000;
    createFireworkInQuarter(randomQuarter, element, wrapperSize, timing, speed, angle, x, y, duration);
  }
}

document.body.addEventListener("click", createFirework);
