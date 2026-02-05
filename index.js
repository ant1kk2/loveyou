const PHRASE = "love you";
const PARTS_COUNT = 50;
const wrapper = document.querySelector(".wrapper")
const diag = Math.sqrt(wrapper.clientWidth ** 2 + wrapper.clientHeight ** 2)

function createElement(e, type) {
  const elWrapper = document.createElement("div");
  switch (type) {
    case "circle":
      const size = Math.random() * diag / 50 + 5;
      const bgColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`

      elWrapper.style.left = e.clientX - size / 2 + "px";
      elWrapper.style.top = e.clientY - size / 2 + "px";
      elWrapper.style.width = size + "px";
      elWrapper.style.height = size + "px";
      elWrapper.style.backgroundColor = bgColor;
      elWrapper.className = "resize";
      break;
      
    case "letter":
      elWrapper.className = "letter-wrapper"
      elWrapper.style.left = e.clientX - 20 + "px";
      elWrapper.style.top = e.clientY - 20 + "px";
    default:
      break;
  }
  return elWrapper
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
  if (el.getBoundingClientRect().top <= 0) {
    el.style.top = 0 + 'px'
  }
  if (el.getBoundingClientRect().left <= 0) {
    el.style.left = 0 + 'px'
  }
  if (el.getBoundingClientRect().right >= wrapperSize.width) {
    el.style.left = wrapperSize.width - el.getBoundingClientRect().width + "px"
  }
  if (el.getBoundingClientRect().bottom >= wrapperSize.height) {
    el.style.top = wrapperSize.height - el.getBoundingClientRect().height + "px"
  }
}

function createFireworkInQuarter(quarter, el, wrapperSize, timing, speed, angle, x, y, duration) {
  animate({
    timing(timeFraction) {
      return timeFraction * timing
    },
    draw(progress) {
      switch (quarter) {
        case 1:
          el.style.top = y + Math.pow((progress * speed - speed), 2) - Math.pow(speed, 2) + 'px';
          el.style.left = x + progress * angle * 2 + 'px'
          break;
        case 2:
          el.style.top = y + Math.pow((progress * speed), 2) + 'px';
          el.style.left = x + progress * angle * 2 + 'px';
          break;
        case 3:
          el.style.top = y + Math.pow((progress * speed), 2) + 'px';
          el.style.left = x - progress * angle * 2 + 'px'
          break;
        case 4:
          el.style.top = y + Math.pow((progress * speed - speed), 2) - Math.pow(speed, 2) + 'px';
          el.style.left = x - progress * angle * 2 + 'px'
          break;
        default:
          break;
      }
      addElementsLimits(el, wrapperSize)
    },
    duration: duration
  })
}

function createParameters(el) {
  const x = parseFloat(el.style.left);
  const y = parseFloat(el.style.top);
  const angle = Math.random() * 120;
  const speed = Math.random() * 20;
  const timing = Math.random() + 0.5;
  return { x, y, angle, speed, timing }
}

function createAnimation(randomizer, elCounts, el, wrapperSize, timing, speed, angle, x, y, duration) {
  if (randomizer < elCounts / 4) {
    createFireworkInQuarter(1, el, wrapperSize, timing, speed, angle, x, y, duration)
  } else if (randomizer < elCounts / 2) {
    createFireworkInQuarter(2, el, wrapperSize, timing, speed, angle, x, y, duration)
  } else if (randomizer < 3 * elCounts / 4) {
    createFireworkInQuarter(3, el, wrapperSize, timing, speed, angle, x, y, duration)
  } else {
    createFireworkInQuarter(4, el, wrapperSize, timing, speed, angle, x, y, duration)
  }
}

function createFirework(e) {
  const wrapperSize = wrapper.getBoundingClientRect();
  const letters = PHRASE.toUpperCase().split("").sort().reverse();
  const filteredLetters = letters.filter(l => l !== " ");
  const elCounts = PARTS_COUNT + filteredLetters.length;
  let element
  for (let i = 0; i < elCounts; i++) {
    const randomizer = Math.random() * (filteredLetters.length + PARTS_COUNT);
    if (i < filteredLetters.length) {
      const letter = createElement(e, "letter", i);
      letter.innerText = filteredLetters[i];
      element = letter
      const { x, y, angle, speed, timing } = createParameters(letter)
      createAnimation(randomizer, elCounts, letter, wrapperSize, timing, speed, angle, x, y, 1400)
    } else {
      const circle = createElement(e, "circle");
      element = circle
      const { x, y, angle, speed, timing } = createParameters(circle);
      createAnimation(randomizer, elCounts, circle, wrapperSize, timing, speed, angle, x, y, 1000)
    }
    wrapper.append(element);
    setTimeout(() => element.remove(), 1400);
  }
}

document.body.addEventListener("click", createFirework)