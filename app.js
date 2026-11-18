(() => {
  "use strict";

  const categories = {
    circuits: "CKT / Electronics",
    photography: "Photography",
    video: "Video",
    other: "Other",
  };
  const starterProjects = [
    { id: "sample-circuit", title: "A small signal", category: "circuits", year: "2026", description: "A first look at the work that happens on the bench.", sampleLabel: "BOARD STUDY", symbol: "ϟ", isExample: true, files: [] },
    { id: "sample-photo", title: "Light, held still", category: "photography", year: "2025", description: "A visual study in color, texture, and the everyday.", sampleLabel: "VISUAL STUDY", symbol: "◌", isExample: true, files: [] },
    { id: "sample-video", title: "In the making", category: "video", year: "2025", description: "A short window into a process, from first sketch to final frame.", sampleLabel: "PROCESS FILM", symbol: "▶", isExample: true, files: [] },
  ];

  const grid = document.querySelector("#project-grid");
  const detailDialog = document.querySelector("#detail-dialog");
  const detailContent = document.querySelector("#detail-content");
  let allProjects = starterProjects;
  let activeFilter = "all";

  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const formatBytes = (bytes = 0) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  function mediaUrl(file) {
    if (!file?.url) return null;
    try {
      const url = new URL(file.url, document.baseURI);
      return ["http:", "https:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  function fileType(file) {
    if (file.type) return file.type;
    const extension = file.name?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "avif"].includes(extension)) return `image/${extension === "jpg" ? "jpeg" : extension}`;
    if (["mp4", "webm", "mov"].includes(extension)) return `video/${extension === "mov" ? "quicktime" : extension}`;
    if (["mp3", "wav", "ogg"].includes(extension)) return `audio/${extension}`;
    return "application/octet-stream";
  }

  function placeholder(project) {
    const cssCategory = project.category === "photography" ? "art-photo" : project.category === "video" ? "art-video" : project.category === "circuits" ? "art-circuit" : "art-photo";
    return `<div class="project-placeholder ${cssCategory}"><span class="placeholder-label"><span class="placeholder-symbol">${escapeHtml(project.symbol || "✳")}</span><span>${escapeHtml(project.sampleLabel || "PROJECT NOTES")}</span></span></div>`;
  }

  function coverMarkup(project) {
    const file = project.files?.find((item) => fileType(item).startsWith("image/") || fileType(item).startsWith("video/"));
    if (!file) return `${placeholder(project)}${project.isExample ? '<span class="project-art-badge">SAMPLE</span>' : ""}`;
    const url = mediaUrl(file);
    if (!url) return placeholder(project);
    const media = fileType(file).startsWith("video/")
      ? `<video src="${escapeHtml(url)}" muted playsinline preload="metadata" aria-label="Video for ${escapeHtml(project.title)}"></video><span class="project-play" aria-hidden="true">▶</span>`
      : `<img src="${escapeHtml(url)}" alt="${escapeHtml(project.title)}" loading="lazy" />`;
    return `${media}${project.isExample ? '<span class="project-art-badge">SAMPLE</span>' : ""}`;
  }

  function renderCounts(projects) {
    document.querySelector('[data-count="all"]').textContent = String(projects.length).padStart(2, "0");
    for (const category of Object.keys(categories)) {
      const count = projects.filter((project) => project.category === category).length;
      document.querySelector(`[data-count="${category}"]`).textContent = String(count).padStart(2, "0");
    }
  }

  function renderProjects() {
    const visible = activeFilter === "all" ? allProjects : allProjects.filter((project) => project.category === activeFilter);
    renderCounts(allProjects);
    document.querySelector("#visible-count").textContent = String(visible.length).padStart(2, "0");
    if (!visible.length) {
      grid.innerHTML = `<div class="empty-state"><span class="empty-icon">+</span><h3>A little space for something new.</h3><p>Add a project to the collection from GitHub. The site will update after your commit.</p><a class="button button-dark" href="https://github.com/shubham-coder-coder/shubham-coder-coder.github.io/edit/main/projects.json">Edit projects <span>↗</span></a></div>`;
      return;
    }
    grid.innerHTML = visible.map((project, index) => {
      const categoryName = categories[project.category] || categories.other;
      const fileCount = project.files?.length || 0;
      return `<article class="project-card" data-project-id="${escapeHtml(project.id)}" tabindex="0" role="button" aria-label="Open ${escapeHtml(project.title)}" style="animation-delay:${Math.min(index * 45, 180)}ms">
        <div class="project-art">${coverMarkup(project)}</div>
        <div class="project-info"><div class="project-meta"><span class="project-category">${escapeHtml(categoryName)}</span><span>${escapeHtml(project.year || "ONGOING")}</span></div>
        <span class="project-title">${escapeHtml(project.title)}</span>${project.description ? `<p class="project-description">${escapeHtml(project.description)}</p>` : ""}
        ${fileCount ? `<span class="project-file-count">↗ ${fileCount} ${fileCount === 1 ? "file" : "files"}</span>` : ""}</div>
      </article>`;
    }).join("");
  }

  async function loadProjects() {
    try {
      const response = await fetch("./projects.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Project list not found");
      const manifest = await response.json();
      if (!Array.isArray(manifest.projects)) throw new Error("Project list is invalid");
      allProjects = manifest.projects;
    } catch {
      // File previews opened directly from disk use these starter cards.
      allProjects = starterProjects;
    }
    renderProjects();
  }

  function openDetails(id) {
    const project = allProjects.find((item) => item.id === id);
    if (!project) return;
    const categoryName = categories[project.category] || categories.other;
    const cover = project.files?.find((item) => fileType(item).startsWith("image/") || fileType(item).startsWith("video/"));
    const coverUrl = mediaUrl(cover);
    const coverContent = coverUrl && cover
      ? fileType(cover).startsWith("video/")
        ? `<video src="${escapeHtml(coverUrl)}" controls playsinline preload="metadata"></video>`
        : `<img src="${escapeHtml(coverUrl)}" alt="${escapeHtml(project.title)}" />`
      : placeholder(project);
    const files = (project.files || []).map((file) => {
      const url = mediaUrl(file);
      if (!url) return "";
      const size = file.size ? `<small>${formatBytes(file.size)}</small>` : "";
      return `<a class="detail-file" href="${escapeHtml(url)}" download="${escapeHtml(file.name || "project-file")}"><span>↓</span>${escapeHtml(file.name || "Project file")} ${size}</a>`;
    }).join("");
    detailContent.innerHTML = `<div class="detail-media">${coverContent}</div><div class="detail-body"><div class="project-meta"><span class="project-category">${escapeHtml(categoryName)}</span><span>${escapeHtml(project.year || "ONGOING")}</span></div><h2 id="detail-title">${escapeHtml(project.title)}</h2>${project.description ? `<p>${escapeHtml(project.description)}</p>` : ""}${files ? `<div class="detail-files">${files}</div>` : ""}<div class="detail-actions"><span class="micro-label">${project.isExample ? "SAMPLE PROJECT — REPLACE WITH YOUR WORK" : "PROJECT FILES"}</span></div></div>`;
    detailDialog.showModal();
  }

  document.querySelectorAll(".filter-chip").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      const selected = chip === button;
      chip.classList.toggle("active", selected);
      chip.setAttribute("aria-pressed", String(selected));
    });
    renderProjects();
  }));

  document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
  detailDialog.addEventListener("click", (event) => { if (event.target === detailDialog) detailDialog.close(); });

  grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-project-id]");
    if (card) openDetails(card.dataset.projectId);
  });
  grid.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-project-id]")) {
      event.preventDefault();
      openDetails(event.target.dataset.projectId);
    }
  });

  loadProjects();
})();

