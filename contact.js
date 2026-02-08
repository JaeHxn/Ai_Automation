const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const openContactModalBtn = document.getElementById("openContactModalBtn");
const closeContactModalBtn = document.getElementById("closeContactModalBtn");
const contactModal = document.getElementById("contactModal");
const contactModalBackdrop = document.getElementById("contactModalBackdrop");

const contactForm = document.getElementById("contactForm");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");
const contactStatusText = document.getElementById("contactStatusText");
const contactNameInput = document.getElementById("contactName");
const contactImageInput = document.getElementById("contactImage");

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

function mapErrorCodeToMessage(code) {
  switch (code) {
    case "REQUIRED_FIELDS_MISSING":
      return "필수 입력값이 누락되었습니다.";
    case "ATTACHMENT_REQUIRED":
      return "이미지 1장을 첨부해 주세요.";
    case "ATTACHMENT_NOT_IMAGE":
      return "이미지 파일만 첨부할 수 있습니다.";
    case "ATTACHMENT_TOO_LARGE":
      return "이미지 용량은 10MB 이하여야 합니다.";
    case "DAILY_LIMIT_EXCEEDED_IP":
    case "DAILY_LIMIT_EXCEEDED_EMAIL":
      return "하루 문의 한도(5회)를 초과했습니다. 내일 다시 시도해 주세요.";
    case "UPSTASH_NOT_CONFIGURED":
    case "CONTACT_RECEIVER_NOT_CONFIGURED":
      return "서버 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요.";
    case "FORMSUBMIT_HTTP_ERROR":
    case "FORMSUBMIT_REJECTED":
    case "MAIL_FORWARD_FAILED":
      return "이메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    default:
      return "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!contactForm) {
    return;
  }

  if (!validateFormValues()) {
    return;
  }

  setLoadingState(true);
  setContactStatus("문의 내용을 전송하고 있습니다.", "");

  const payload = new FormData(contactForm);

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      body: payload,
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      const message = mapErrorCodeToMessage(result.code);
      setContactStatus(message, "error");
      return;
    }

    contactForm.reset();
    setContactStatus("전송이 완료되었습니다. 운영자가 확인 후 회신합니다.", "success");
  } catch (_error) {
    setContactStatus(
      "전송 API에 연결하지 못했습니다. 배포 환경에서 다시 시도해 주세요.",
      "error",
    );
  } finally {
    setLoadingState(false);
  }
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
