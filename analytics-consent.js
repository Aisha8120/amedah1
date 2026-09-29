(function () {
  'use strict';

  const MEASUREMENT_ID = 'G-N6DVTH4DXB';
  const CONSENT_KEY = 'amedah_analytics_consent';
  let choice = null;
  let started = false;

  try { choice = localStorage.getItem(CONSENT_KEY); } catch (_) { /* Storage can be unavailable. */ }

  function remember(value) {
    choice = value;
    try { localStorage.setItem(CONSENT_KEY, value); } catch (_) { /* Keep this page's choice. */ }
  }

  function startAnalytics() {
    if (started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID);
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(tag);
  }

  function removeBanner() {
    const banner = document.getElementById('amedah-analytics-consent');
    if (banner) banner.remove();
  }

  function showBanner() {
    if (document.getElementById('amedah-analytics-consent')) return;
    const banner = document.createElement('aside');
    banner.id = 'amedah-analytics-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'اختيار تحليلات الموقع');
    banner.dir = 'rtl';
    banner.style.cssText = 'position:fixed;right:16px;bottom:16px;left:16px;z-index:2147483647;max-width:670px;margin:auto;padding:18px 20px;border:1px solid #5b6b9c;border-radius:16px;background:#111a32;color:#fff;box-shadow:0 14px 44px #0009;font:15px/1.8 system-ui,sans-serif';
    banner.innerHTML = '<p style="margin:0 0 12px">نستخدم تحليلات Google لقياس زيارات الموقع والضغط على روابط التواصل، بعد موافقتك فقط. <a href="/privacy.html" style="color:#b8caff">تفاصيل الخصوصية</a></p><div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" data-consent="accept" style="cursor:pointer;border:0;border-radius:9px;padding:8px 20px;background:#496ce8;color:#fff;font:inherit">أوافق على التحليلات</button><button type="button" data-consent="reject" style="cursor:pointer;border:1px solid #aeb9d4;border-radius:9px;padding:8px 20px;background:transparent;color:#fff;font:inherit">أرفض</button></div>';
    banner.addEventListener('click', function (event) {
      const button = event.target.closest('[data-consent]');
      if (!button) return;
      const accepted = button.getAttribute('data-consent') === 'accept';
      remember(accepted ? 'accepted' : 'rejected');
      removeBanner();
      if (accepted) startAnalytics();
      else if (started) window.location.reload();
    });
    document.body.appendChild(banner);
  }

  document.addEventListener('click', function (event) {
    const settings = event.target.closest('[data-analytics-settings]');
    if (settings) {
      event.preventDefault();
      showBanner();
      return;
    }
    const link = event.target.closest('a[href]');
    if (!link || choice !== 'accepted' || !started) return;
    try {
      const url = new URL(link.href);
      if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com') {
        window.gtag('event', 'whatsapp_click', { contact_channel: 'whatsapp' });
      }
    } catch (_) { /* Ignore malformed links. */ }
  }, true);

  if (choice === 'accepted') startAnalytics();
  else if (choice !== 'rejected') {
    if (document.body) showBanner();
    else document.addEventListener('DOMContentLoaded', showBanner, { once: true });
  }
})();
