(() => {
  "use strict";

  /* =========================================================
   * 運営者向け設定（本番公開前にここだけ書き換えてください）
   * ========================================================= */
  const CONFIG = {
    // Microsoft Forms の申込フォームURLに差し替えてください
    FORMS_URL: "https://forms.office.com/REPLACE_WITH_YOUR_FORM_URL",

    EVENT_TITLE: "中小企業の生成AI活用について（オンラインセミナー）",
    EVENT_START: "2026-11-27T14:00:00+09:00",
    EVENT_END: "2026-11-27T16:00:00+09:00",
    EVENT_LOCATION: "オンライン開催（Web会議システム／詳細はお申込み後にご案内）",
    EVENT_DESCRIPTION: "ひかりデジタルパートナーズ主催の生成AI活用オンラインセミナーです。",

    // 任意：申込状況に応じて残席バーの表示を調整する場合はここを更新
    TOTAL_SEATS: 200,
    REGISTERED_SEATS: 0,
  };

  const isFormsReady = !CONFIG.FORMS_URL.includes("REPLACE_WITH");

  /* ===== 申込ボタンの href 設定 ===== */
  const applyButtons = document.querySelectorAll(".cta-apply");
  applyButtons.forEach((btn) => {
    if (isFormsReady) {
      btn.href = CONFIG.FORMS_URL;
    } else {
      btn.href = "#entry";
      btn.classList.add("is-pending");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        alert("申込フォームのURLを準備中です。もうしばらくお待ちください。");
      });
    }
  });

  /* ===== カウントダウン ===== */
  const start = new Date(CONFIG.EVENT_START);
  const end = new Date(CONFIG.EVENT_END);
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    min: document.getElementById("cd-min"),
    sec: document.getElementById("cd-sec"),
    label: document.querySelector(".countdown-label"),
  };

  function tick() {
    const now = new Date();
    let diff = start - now;

    if (diff <= 0) {
      if (now < end) {
        if (els.label) els.label.textContent = "ただいま開催中";
      } else {
        if (els.label) els.label.textContent = "セミナーは終了しました";
      }
      els.days.textContent = "00";
      els.hours.textContent = "00";
      els.min.textContent = "00";
      els.sec.textContent = "00";
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    els.days.textContent = String(d).padStart(2, "0");
    els.hours.textContent = String(h).padStart(2, "0");
    els.min.textContent = String(m).padStart(2, "0");
    els.sec.textContent = String(s).padStart(2, "0");
  }
  if (els.days) {
    tick();
    setInterval(tick, 1000);
  }

  /* ===== カレンダー追加 ===== */
  function toGoogleDate(d) {
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  const googleBtn = document.getElementById("addGoogleCal");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: CONFIG.EVENT_TITLE,
        dates: `${toGoogleDate(start)}/${toGoogleDate(end)}`,
        details: CONFIG.EVENT_DESCRIPTION,
        location: CONFIG.EVENT_LOCATION,
        ctz: "Asia/Tokyo",
      });
      window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank", "noopener");
    });
  }

  function toIcsDate(d) {
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  const icsBtn = document.getElementById("addIcsCal");
  if (icsBtn) {
    icsBtn.addEventListener("click", () => {
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Hikari Digital Partners//AI Seminar//JA",
        "BEGIN:VEVENT",
        `UID:ai-seminar-20261127@hikari-dp.co.jp`,
        `DTSTAMP:${toIcsDate(new Date())}`,
        `DTSTART:${toIcsDate(start)}`,
        `DTEND:${toIcsDate(end)}`,
        `SUMMARY:${CONFIG.EVENT_TITLE}`,
        `DESCRIPTION:${CONFIG.EVENT_DESCRIPTION}`,
        `LOCATION:${CONFIG.EVENT_LOCATION}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai-seminar-20261127.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  /* ===== 残席バー ===== */
  const fill = document.getElementById("capacityFill");
  const text = document.getElementById("capacityText");
  if (fill && text) {
    const ratio = Math.min(CONFIG.REGISTERED_SEATS / CONFIG.TOTAL_SEATS, 1);
    const remaining = Math.max(CONFIG.TOTAL_SEATS - CONFIG.REGISTERED_SEATS, 0);
    fill.style.width = `${Math.max(ratio * 100, 3)}%`;
    if (ratio < 0.5) {
      text.textContent = `定員${CONFIG.TOTAL_SEATS}名に対し、まだ余裕があります`;
    } else if (ratio < 0.85) {
      text.textContent = `お申込みが増えています（残り約${remaining}名）`;
    } else {
      text.textContent = `まもなく定員に達します（残り約${remaining}名）`;
    }
  }

  /* ===== QRコード ===== */
  const qrEl = document.getElementById("qrcode");
  if (qrEl && window.QRCode) {
    new QRCode(qrEl, {
      text: window.location.href,
      width: 160,
      height: 160,
      colorDark: "#112A63",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
  }

  /* ===== モバイルメニュー ===== */
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ===== スクロールフェードイン ===== */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in-view"));
  }
})();
