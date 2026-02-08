const RECEIVER_BASE64 = "bHV2c291bEBrYWthby5jb20=";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const openContactModalBtn = document.getElementById("openContactModalBtn");
const closeContactModalBtn = document.getElementById("closeContactModalBtn");
const contactModal = document.getElementById("contactModal");
const contactModalBackdrop = document.getElementById("contactModalBackdrop");

const contactForm = document.getElementById("contactForm");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");
const contactStatusText = document.getElementById("contactStatusText");
const contactNameInput = document.getElementById("contactName");
const contactSubjectInput = document.getElementById("contactSubject");
const contactImageInput = document.getElementById("contactImage");
const contactMailSubjectInput = document.getElementById("contactMailSubjectInput");
const contactNextInput = document.getElementById("contactNextInput");

function getReceiverEmail() {
  try {
    return atob(RECEIVER_BASE64);
  } catch (_error) {
    return "";
  }
}

function setContactStatus(message, kind) {
  if (!contactStatusText) {
    return;
  }

  contactStatusText.textContent = message;
  contactStatusText.classList.remove("status-success", "status-error");
  if (kind === "success") {
    contactStatusText.classList.add("status-success");
  } else if (kind === "error") {
    contactStatusText.classList.add("status-error");
  }
}

function setLoadingState(isLoading) {
  if (!contactSubmitBtn) {
    return;
  }
  contactSubmitBtn.disabled = isLoading;
  contactSubmitBtn.textContent = isLoading ? "전송 중..." : "사이트에서 전송";
}

function openContactModal() {
  if (!contactModal) {
    return;
  }
  contactModal.hidden = false;
  document.body.classList.add("modal-open");
  if (contactNameInput) {
    contactNameInput.focus();
  }
}

function closeContactModal() {
  if (!contactModal) {
    return;
  }
  contactModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function validateFormValues() {
  if (!contactForm) {
    return false;
  }

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const attachment = contactImageInput && contactImageInput.files
    ? contactImageInput.files[0]
    : null;

  if (!name || !email || !subject || !message) {
    setContactStatus("모든 항목을 입력해 주세요.", "error");
    return false;
  }

  if (!attachment) {
    setContactStatus("이미지 1장을 첨부해 주세요.", "error");
    return false;
  }

  if (!attachment.type || !attachment.type.startsWith("image/")) {
    setContactStatus("이미지 파일만 첨부할 수 있습니다.", "error");
    return false;
  }

  if (attachment.size > MAX_IMAGE_BYTES) {
    setContactStatus("이미지 용량은 10MB 이하여야 합니다.", "error");
    return false;
  }

  return true;
}

function handleSubmit(event) {
  const receiverEmail = getReceiverEmail();
  if (!receiverEmail) {
    event.preventDefault();
    setContactStatus("메일 전송 설정 오류가 발생했습니다.", "error");
    return;
  }

  if (!validateFormValues()) {
    event.preventDefault();
    return;
  }

  if (contactMailSubjectInput && contactSubjectInput) {
    const rawSubject = contactSubjectInput.value.trim();
    contactMailSubjectInput.value = `[길돈 운세 문의] ${rawSubject || "문의 접수"}`;
  }

  if (contactNextInput) {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    contactNextInput.value = `${baseUrl}?sent=1`;
  }

  setContactStatus("문의 내용을 전송하고 있습니다.", "");
  setLoadingState(true);
}

const receiverEmail = getReceiverEmail();
if (contactForm && receiverEmail) {
  contactForm.action = `https://formsubmit.co/${encodeURIComponent(receiverEmail)}`;
}

if (openContactModalBtn) {
  openContactModalBtn.addEventListener("click", openContactModal);
}

if (closeContactModalBtn) {
  closeContactModalBtn.addEventListener("click", closeContactModal);
}

if (contactModalBackdrop) {
  contactModalBackdrop.addEventListener("click", closeContactModal);
}

if (contactForm) {
  contactForm.addEventListener("submit", handleSubmit);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && contactModal && !contactModal.hidden) {
    closeContactModal();
  }
});

const query = new URLSearchParams(window.location.search);
if (query.get("sent") === "1") {
  setContactStatus("전송이 완료되었습니다. 운영자가 확인 후 회신합니다.", "success");
  openContactModal();
  query.delete("sent");
  const cleanedUrl = `${window.location.pathname}${query.toString() ? `?${query.toString()}` : ""}`;
  window.history.replaceState({}, "", cleanedUrl);
}
