const fromSlider = document.getElementById('fromSlider');
const toSlider = document.getElementById('toSlider');
const fromValue = document.getElementById('fromValue');
const toValue = document.getElementById('toValue');

fromSlider.addEventListener('input', () => {
  fromValue.textContent = fromSlider.value;
});

toSlider.addEventListener('input', () => {
  toValue.textContent = toSlider.value;
});
