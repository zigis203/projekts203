const form = document.querySelector("#booking-form");
const monthLabel = document.querySelector("#month-label");
const daysContainer = document.querySelector("#calendar-days");
const prevButton = document.querySelector("#prev-month");
const nextButton = document.querySelector("#next-month");
const dateInput = document.querySelector("#appointment-date");
const selectedDateLabel = document.querySelector("#selected-date");
const fileInput = document.querySelector("#inspiration");
const fileList = document.querySelector("#file-list");
const errorBox = document.querySelector("#form-error");
const successBox = document.querySelector("#success-message");

let viewYear = 2026;
let viewMonth = 9; // October, zero-based
let selectedDate = "";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Demo availability: weekdays are available except a few blocked dates.
// Replace this function with availability returned by your booking API later.
function isDateAvailable(date) {
  const weekday = date.getDay();
  const blockedDates = ["2026-10-27", "2026-10-28", "2026-11-03"];
  return date >= startOfToday() && weekday !== 0 && weekday !== 1 &&
    !blockedDates.includes(formatISO(date));
}
function startOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}
function formatISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function formatLatvianDate(date) {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}.`;
}
function renderCalendar() {
  monthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;
  daysContainer.innerHTML = "";
  const firstDay = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  for (let i = 0; i < firstDay.getDay(); i++) {
    const blank = document.createElement("span");
    blank.className = "day empty";
    blank.setAttribute("aria-hidden", "true");
    daysContainer.appendChild(blank);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(viewYear, viewMonth, day);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day";
    button.textContent = day;
    button.setAttribute("aria-label", formatLatvianDate(date));
    if (isDateAvailable(date)) {
      button.classList.add("available");
      button.addEventListener("click", () => {
        selectedDate = formatISO(date);
        dateInput.value = selectedDate;
        selectedDateLabel.textContent = `Selected date: ${formatLatvianDate(date)}`;
        errorBox.textContent = "";
        renderCalendar();
      });
    } else {
      button.classList.add("unavailable");
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
    }
    if (selectedDate === formatISO(date)) {
      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
    }
    daysContainer.appendChild(button);
  }
  // Both arrow buttons stay usable for month navigation. Dates in the past remain disabled. 
  prevButton.disabled = false;
  nextButton.disabled = false;
}
prevButton.addEventListener("click", () => {
  if (viewMonth === 0) { viewYear--; viewMonth = 11; }
  else viewMonth--;
  renderCalendar();
});
nextButton.addEventListener("click", () => {
  if (viewMonth === 11) { viewYear++; viewMonth = 0; }
  else viewMonth++;
  renderCalendar();
});

fileInput.addEventListener("change", () => {
  const files = Array.from(fileInput.files);
  const maxSize = 8 * 1024 * 1024;
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  const invalid = files.find(file => !allowed.includes(file.type) || file.size > maxSize);
  if (invalid) {
    fileInput.value = "";
    fileList.textContent = `${invalid.name}: choose a JPG, PNG or WebP image up to 8 MB.`;
    fileList.style.color = "#9c3e32";
    return;
  }
  fileList.style.color = "";
  fileList.textContent = files.length ? files.map(file => file.name).join(", ") : "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorBox.textContent = "";
  successBox.hidden = true;
  if (!form.checkValidity()) {
    form.reportValidity();
    errorBox.textContent = "Please complete all required fields and agree to the privacy policy.";
    return;
  }
  if (!dateInput.value) {
    errorBox.textContent = "Please select an available appointment date in the calendar.";
    selectedDateLabel.textContent = "Please select an available date.";
    return;
  }
  const formData = new FormData(form);
  const summary = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    appointmentDate: formData.get("appointmentDate"),
    message: formData.get("message")
  };

  // Demo mode: this validates and displays a confirmation locally.
  // It does NOT email or save the reservation to a server.
  console.info("Demo reservation request:", summary);
  successBox.textContent = `Thank you, ${summary.fullName}. Your request for ${summary.service} on ${formatLatvianDate(new Date(`${summary.appointmentDate}T12:00:00`))} has been prepared. This demo does not send the request to a salon; connect a backend or booking API to enable real submissions.`;
  successBox.hidden = false;
  successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

renderCalendar();


document.addEventListener("keydown", (event) => {
  // Keep arrow-key month navigation available when focus is not inside a field.
  const tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
  if (["input", "textarea", "select", "button"].includes(tag)) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    if (viewMonth === 0) { viewYear--; viewMonth = 11; }
    else viewMonth--;
    renderCalendar();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    if (viewMonth === 11) { viewYear++; viewMonth = 0; }
    else viewMonth++;
    renderCalendar();
  }
});
