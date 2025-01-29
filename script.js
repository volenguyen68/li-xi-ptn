/*--------------------
Vars
--------------------*/
let progress = 0; // Hiển thị ảnh đầu tiên
let startX = 0;
let active = 0;
let isDown = false;
let timeoutId = null; // Lưu timeout để tránh chạy nhiều lần
let countdown = null; // Lưu bộ đếm giây
let timeLeft = 10; // Số giây đếm ngược mặc định

/*--------------------
Constants
--------------------*/
const speedWheel = 0.02;
const speedDrag = -0.1;
const redirectDelay = 3000; // 10 giây (10,000 ms)
const redirectURL = "https://lixi.momo.vn/lixi/Dn2LrA0WLQRg40o"; // Link chuyển hướng

/*--------------------
Get Z-index
--------------------*/
const getZindex = (array, index) =>
  array.map((_, i) =>
    index === i ? array.length : array.length - Math.abs(index - i)
  );

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll(".carousel-item");
const $cursors = document.querySelectorAll(".cursor");

// Tạo phần tử đếm ngược
const countdownElement = document.createElement("div");
countdownElement.style.position = "absolute";
countdownElement.style.top = "50%";
countdownElement.style.left = "50%";
countdownElement.style.transform = "translate(-50%, -50%)";
countdownElement.style.background = "rgba(0, 0, 0, 0.7)";
countdownElement.style.color = "white";
countdownElement.style.fontSize = "24px";
countdownElement.style.padding = "10px 20px";
countdownElement.style.borderRadius = "10px";
countdownElement.style.display = "none"; // Ẩn ban đầu
document.body.appendChild(countdownElement);

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index];
  item.style.setProperty("--zIndex", zIndex);
  item.style.setProperty("--active", (index - active) / $items.length);
};

/*--------------------
Animate
--------------------*/
const animate = () => {
  progress = Math.max(0, Math.min(progress, 100));
  active = Math.floor((progress / 100) * ($items.length - 1));

  $items.forEach((item, index) => displayItems(item, index, active));

  // Nếu đang ở ảnh thứ 10
  if (active === 9) {
    console.log("Đang ở ảnh thứ 10, sẽ chuyển hướng sau 10 giây...");

    // Hiển thị bộ đếm trên ảnh
    countdownElement.style.display = "block";
    countdownElement.innerText = `Chuyển sau: ${timeLeft}s`;

    // Nếu chưa có timeout, bắt đầu đếm
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        window.location.href = redirectURL;
      }, redirectDelay);

      // Cập nhật bộ đếm mỗi giây
      countdown = setInterval(() => {
        timeLeft--;
        countdownElement.innerText = `Chuyển sau: ${timeLeft}s`;
      }, 1000);
    }
  } else {
    // Nếu không phải ảnh 10 thì hủy timeout & bộ đếm
    clearTimeout(timeoutId);
    clearInterval(countdown);
    timeoutId = null;
    countdown = null;
    timeLeft = 10;
    countdownElement.style.display = "none"; // Ẩn bộ đếm
  }
};
animate();

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener("click", () => {
    progress = (i / $items.length) * 100 + 10;
    animate();
  });
});

/*--------------------
Handlers
--------------------*/
const handleWheel = (e) => {
  const wheelProgress = e.deltaY * speedWheel;
  progress = progress + wheelProgress;
  animate();
};

const handleMouseMove = (e) => {
  if (e.type === "mousemove") {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }
  if (!isDown) return;
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  const mouseProgress = (x - startX) * speedDrag;
  progress = progress + mouseProgress;
  startX = x;
  animate();
};

const handleMouseDown = (e) => {
  isDown = true;
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
};

const handleMouseUp = () => {
  isDown = false;
};

/*--------------------
Listeners
--------------------*/
document.addEventListener("mousewheel", handleWheel);
document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("touchstart", handleMouseDown);
document.addEventListener("touchmove", handleMouseMove);
document.addEventListener("touchend", handleMouseUp);
