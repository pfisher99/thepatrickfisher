document.addEventListener("DOMContentLoaded", () => {
  const codeBlocks = document.querySelectorAll(".post pre");
  const figureLinks = document.querySelectorAll(".post-figure-link");
  const languageLabels = {
    shellscript: "bash",
  };

  codeBlocks.forEach((pre) => {
    if (pre.closest(".code-block")) {
      return;
    }

    const source = pre.closest(".code-block-source");
    const code = pre.querySelector("code");
    const explicitTitle = source?.dataset.codeTitle?.trim();
    const rawLanguage = (source?.dataset.codeLang || code?.dataset.lang || "text").trim();
    const language = languageLabels[rawLanguage] || rawLanguage;
    const collapsed = source?.dataset.codeCollapsed === "true";
    const downloadUrl = source?.dataset.codeDownloadUrl?.trim();
    const downloadLabel = source?.dataset.codeDownloadLabel?.trim() || "Download";
    const title = explicitTitle || (language && language !== "text" && language !== "plain"
      ? language
      : "Code");

    const details = document.createElement("details");
    details.className = "code-block";
    details.open = !collapsed;

    const summary = document.createElement("summary");
    summary.className = "code-block__summary";

    const meta = document.createElement("span");
    meta.className = "code-block__meta";

    const titleNode = document.createElement("span");
    titleNode.className = "code-block__title mono";
    titleNode.textContent = title;

    meta.append(titleNode);

    if (language && language !== "text" && language !== "plain" && language !== title) {
      const langNode = document.createElement("span");
      langNode.className = "code-block__lang mono";
      langNode.textContent = language;
      meta.append(langNode);
    }

    summary.append(meta);

    const actions = document.createElement("span");
    actions.className = "code-block__actions";

    if (downloadUrl) {
      const download = document.createElement("a");
      download.className = "code-block__download mono";
      download.href = downloadUrl;
      download.textContent = downloadLabel;
      download.setAttribute("download", "");
      download.addEventListener("click", (event) => {
        event.stopPropagation();
      });
      actions.append(download);
    }

    const toggle = document.createElement("span");
    toggle.className = "code-block__toggle mono";
    toggle.setAttribute("aria-hidden", "true");
    toggle.textContent = collapsed ? "Expand" : "Collapse";
    actions.append(toggle);

    details.addEventListener("toggle", () => {
      toggle.textContent = details.open ? "Collapse" : "Expand";
    });

    summary.append(actions);
    details.append(summary);

    if (source) {
      source.parentNode.insertBefore(details, source);
      details.append(pre);
      source.remove();
      return;
    }

    pre.parentNode.insertBefore(details, pre);
    details.append(pre);
  });

  if (figureLinks.length && typeof HTMLDialogElement !== "undefined") {
    const dialog = document.createElement("dialog");
    dialog.className = "image-popout";
    dialog.innerHTML = `
      <div class="image-popout__frame">
        <button type="button" class="image-popout__close mono" aria-label="Close image">Close</button>
        <img class="image-popout__image" alt="">
        <p class="image-popout__caption"></p>
      </div>
    `;

    const frame = dialog.querySelector(".image-popout__frame");
    const image = dialog.querySelector(".image-popout__image");
    const caption = dialog.querySelector(".image-popout__caption");
    const close = dialog.querySelector(".image-popout__close");

    const resetDialog = () => {
      image.removeAttribute("src");
      image.alt = "";
      caption.textContent = "";
      caption.hidden = true;
    };

    figureLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        const figure = link.closest(".post-figure");
        const preview = link.querySelector(".post-figure-image");
        const figureCaption = figure?.querySelector(".post-figure-caption")?.textContent?.trim() || "";

        image.src = link.href;
        image.alt = preview?.alt || "";
        caption.textContent = figureCaption;
        caption.hidden = figureCaption === "";
        dialog.showModal();
      });
    });

    close.addEventListener("click", () => {
      dialog.close();
    });

    dialog.addEventListener("click", (event) => {
      if (!frame.contains(event.target)) {
        dialog.close();
      }
    });

    dialog.addEventListener("close", resetDialog);

    resetDialog();
    document.body.append(dialog);
  }
});
