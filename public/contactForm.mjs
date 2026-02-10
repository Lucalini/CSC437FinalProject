function isValidEmail(stringToTest) {
  const emailRegex =
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
  // Regex from https://colinhacks.com/essays/reasonable-email-regex
  return emailRegex.test(stringToTest);
}

function setDescribedBy(el, id) {
  const existing = (el.getAttribute("aria-describedby") ?? "").trim();
  const parts = existing ? existing.split(/\s+/) : [];
  if (!parts.includes(id)) parts.push(id);
  el.setAttribute("aria-describedby", parts.join(" "));
}

function clearValidation(form) {
  for (const el of form.querySelectorAll("[aria-invalid='true']")) {
    el.removeAttribute("aria-invalid");
  }
  for (const el of form.querySelectorAll("[aria-describedby]")) {
    // Only remove ids that we created (data-generated-error)
    const describedBy = el.getAttribute("aria-describedby") ?? "";
    const ids = describedBy.split(/\s+/).filter(Boolean);
    const keep = [];
    for (const id of ids) {
      const node = document.getElementById(id);
      if (!node) {
        keep.push(id);
        continue;
      }
      if (!node.hasAttribute("data-generated-error")) {
        keep.push(id);
      }
    }
    if (keep.length) el.setAttribute("aria-describedby", keep.join(" "));
    else el.removeAttribute("aria-describedby");
  }

  for (const err of form.querySelectorAll("[data-generated-error]")) {
    err.remove();
  }
}

function makeError(message, { id, afterEl }) {
  const el = document.createElement("p");
  el.className = "form-error";
  el.id = id;
  el.setAttribute("role", "alert");
  el.setAttribute("data-generated-error", "true");
  el.textContent = message;
  afterEl.insertAdjacentElement("afterend", el);
  return el;
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!(form instanceof HTMLFormElement)) return;

  const emailInput = form.querySelector("#contact-email");
  if (!(emailInput instanceof HTMLInputElement)) return;

  const audienceCheckboxes = Array.from(form.querySelectorAll('input[name="audience"]')).filter(
    (el) => el instanceof HTMLInputElement && el.type === "checkbox"
  );
  if (audienceCheckboxes.length < 2) return;

  const fieldset = form.querySelector("fieldset");
  if (!(fieldset instanceof HTMLFieldSetElement)) return;

  form.addEventListener("submit", (event) => {
    clearValidation(form);

    let firstInvalid = null;
    let isValid = true;

    // Email validation
    const emailValue = emailInput.value.trim();
    if (!emailValue || !isValidEmail(emailValue)) {
      isValid = false;
      emailInput.setAttribute("aria-invalid", "true");
      makeError("Please enter a valid email address.", {
        id: "contact-email-error",
        afterEl: emailInput,
      });
      setDescribedBy(emailInput, "contact-email-error");
      firstInvalid ??= emailInput;
    }

    // Checkbox group validation (at least one checked)
    const anyChecked = audienceCheckboxes.some((cb) => cb.checked);
    if (!anyChecked) {
      isValid = false;
      const errorId = "contact-audience-error";

      for (const cb of audienceCheckboxes) {
        cb.setAttribute("aria-invalid", "true");
        setDescribedBy(cb, errorId);
      }

      makeError("Please select at least one option.", {
        id: errorId,
        afterEl: fieldset,
      });

      firstInvalid ??= audienceCheckboxes[0];
    }

    if (!isValid) {
      event.preventDefault();
      firstInvalid?.focus();
    }
    // If valid: allow submission to proceed (page reload)
  });
}

setupContactForm();

