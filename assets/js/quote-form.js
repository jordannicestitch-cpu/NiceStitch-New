document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('QuoteForm');
  if (!form) return;

  var endpoint = form.getAttribute('data-endpoint') || '/api/quote';
  var statusEl = form.querySelector('.quote-form__status');
  var submitBtn = form.querySelector('.quote-form__submit');
  var submitLabel = form.querySelector('.quote-form__submit-label');
  var MAX_TOTAL_BYTES = 25 * 1024 * 1024;

  var submittingText = 'Sending…';
  var submitText = 'Send quote request';
  var successText = "Thanks — your request is in. We'll follow up by email shortly.";
  var errorText = 'Something went wrong sending your request. Please email us directly or try again.';

  function setStatus(message, state) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.hidden = false;
    statusEl.setAttribute('data-state', state || '');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var fileInput = form.querySelector('#QuoteArtwork');
    var totalBytes = 0;
    if (fileInput && fileInput.files) {
      for (var i = 0; i < fileInput.files.length; i++) {
        totalBytes += fileInput.files[i].size;
      }
    }
    if (totalBytes > MAX_TOTAL_BYTES) {
      setStatus('Artwork files are too large (25MB max total). Please remove a file or compress it.', 'error');
      return;
    }

    var formData = new FormData(form);

    submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = submittingText;
    setStatus('', '');
    statusEl.hidden = true;

    fetch(endpoint, {
      method: 'POST',
      body: formData
    })
      .then(function (response) {
        if (!response.ok) return response.json().catch(function () { return {}; }).then(function (data) { throw new Error(data.error || 'Request failed'); });
        return response.json().catch(function () { return {}; });
      })
      .then(function () {
        setStatus(successText, 'success');
        form.reset();
      })
      .catch(function () {
        setStatus(errorText, 'error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = submitText;
      });
  });
});
